
import fs from "fs";
import mongoose from "mongoose";
import StorageFile from "../models/StorageFile.js";
import Folder from "../models/Folder.js";

const TOTAL_BYTES = 10 * 1024 * 1024 * 1024; // 10 GB — keep in sync with client quota display

const CODE_EXTENSIONS = [
  ".js", ".jsx", ".ts", ".tsx", ".py", ".java", ".c", ".cpp", ".cs",
  ".html", ".css", ".json", ".rb", ".go", ".php", ".sh",
];

function classifyType(mimeType, originalName) {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";

  const lowerName = originalName.toLowerCase();
  if (CODE_EXTENSIONS.some((ext) => lowerName.endsWith(ext))) return "code";

  if (
    mimeType === "application/pdf" ||
    mimeType === "text/plain" ||
    mimeType.includes("msword") ||
    mimeType.includes("officedocument")
  ) {
    return "document";
  }

  return "other";
}

// Normalizes a folderId that might arrive as "", "null", undefined, or a real id.
function normalizeFolderId(raw) {
  if (!raw || raw === "null" || raw === "undefined") return null;
  if (!mongoose.Types.ObjectId.isValid(raw)) return undefined; // signals "invalid"
  return raw;
}

// Resolves + ownership-checks a folder id. Returns { folderId, folder } or throws a {status,message}.
async function resolveFolder(rawFolderId, userId) {
  const folderId = normalizeFolderId(rawFolderId);

  if (folderId === undefined) {
    throw { status: 400, message: "Invalid folder id" };
  }
  if (folderId === null) {
    return { folderId: null, folder: null };
  }

  const folder = await Folder.findOne({ _id: folderId, user: userId });
  if (!folder) {
    throw { status: 404, message: "Folder not found" };
  }
  return { folderId, folder };
}

async function buildBreadcrumbs(folder) {
  const crumbs = [];
  let current = folder;
  while (current) {
    crumbs.unshift({ id: current._id, name: current.name });
    if (!current.parent) break;
    current = await Folder.findById(current.parent);
  }
  return crumbs;
}

// GET /api/storage?folderId=<id>
export async function getStorageData(req, res) {
  try {
    const { folderId, folder } = await resolveFolder(req.query.folderId, req.user._id);

    const [folders, files, allFiles] = await Promise.all([
      Folder.find({ user: req.user._id, parent: folderId }).sort({ name: 1 }),
      StorageFile.find({ user: req.user._id, folder: folderId }).sort({ createdAt: -1 }),
      StorageFile.find({ user: req.user._id }), // for total usage, independent of current folder
    ]);

    const usedBytes = allFiles.reduce((sum, f) => sum + f.sizeBytes, 0);
    const breadcrumbs = folder ? await buildBreadcrumbs(folder) : [];

    res.json({
      usage: { usedBytes, totalBytes: TOTAL_BYTES },
      currentFolder: folder ? { id: folder._id, name: folder.name } : null,
      breadcrumbs,
      folders: folders.map((f) => ({
        id: f._id,
        name: f.name,
        updatedAt: f.updatedAt,
      })),
      files: files.map((f) => ({
        id: f._id,
        name: f.originalName,
        type: f.type,
        sizeBytes: f.sizeBytes,
        updatedAt: f.updatedAt,
      })),
    });
  } catch (err) {
    const status = err.status || 500;
    res.status(status).json({ message: err.message || "Failed to load storage" });
  }
}

// POST /api/storage/upload  (multipart/form-data, field name: "files", optional field: "folderId")
export async function uploadFiles(req, res) {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const { folderId } = await resolveFolder(req.body.folderId, req.user._id);

    const docs = await StorageFile.insertMany(
      req.files.map((file) => ({
        user: req.user._id,
        folder: folderId,
        originalName: file.originalname,
        path: file.path,
        mimeType: file.mimetype,
        sizeBytes: file.size,
        type: classifyType(file.mimetype, file.originalname),
      }))
    );

    res.status(201).json({ uploaded: docs.length });
  } catch (err) {
    // Clean up any files multer already wrote to disk if something failed after
    if (req.files) {
      req.files.forEach((f) => {
        if (fs.existsSync(f.path)) fs.unlinkSync(f.path);
      });
    }
    const status = err.status || 500;
    res.status(status).json({ message: err.message || "Upload failed" });
  }
}

// DELETE /api/storage/:id
export async function deleteFile(req, res) {
  try {
    const file = await StorageFile.findOne({ _id: req.params.id, user: req.user._id });
    if (!file) return res.status(404).json({ message: "File not found" });

    if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
    await file.deleteOne();

    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete file", error: err.message });
  }
}

// POST /api/storage/folders  { name, parentId }
export async function createFolder(req, res) {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Folder name is required" });
    }

    const { folderId: parentId } = await resolveFolder(req.body.parentId, req.user._id);

    const folder = await Folder.create({
      user: req.user._id,
      name: name.trim(),
      parent: parentId,
    });

    res.status(201).json({ folder: { id: folder._id, name: folder.name } });
  } catch (err) {
    const status = err.status || 500;
    res.status(status).json({ message: err.message || "Failed to create folder" });
  }
}

// Recursively collects this folder's id plus every descendant folder id.
async function collectFolderIds(rootId, userId) {
  const ids = [rootId];
  let frontier = [rootId];

  while (frontier.length > 0) {
    const children = await Folder.find({ user: userId, parent: { $in: frontier } });
    if (children.length === 0) break;
    const childIds = children.map((c) => c._id);
    ids.push(...childIds);
    frontier = childIds;
  }

  return ids;
}

// DELETE /api/storage/folders/:id  (cascades: deletes all nested folders + files)
export async function deleteFolder(req, res) {
  try {
    const folder = await Folder.findOne({ _id: req.params.id, user: req.user._id });
    if (!folder) return res.status(404).json({ message: "Folder not found" });

    const folderIds = await collectFolderIds(folder._id, req.user._id);

    const files = await StorageFile.find({ user: req.user._id, folder: { $in: folderIds } });
    files.forEach((f) => {
      if (fs.existsSync(f.path)) fs.unlinkSync(f.path);
    });
    await StorageFile.deleteMany({ user: req.user._id, folder: { $in: folderIds } });
    await Folder.deleteMany({ user: req.user._id, _id: { $in: folderIds } });

    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete folder", error: err.message });
  }
}
