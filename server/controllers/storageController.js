
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

// GET /api/storage/search?q=...
// Searches folder and file names across the user's ENTIRE storage, not
// just the current folder - unlike getStorageData, which is scoped to
// one directory.
export async function searchStorage(req, res) {
  try {
    const q = (req.query.q || "").trim();
    if (!q) return res.json({ folders: [], files: [] });

    const pattern = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");

    const [folders, files] = await Promise.all([
      Folder.find({ user: req.user._id, name: pattern }).sort({ name: 1 }),
      StorageFile.find({ user: req.user._id, originalName: pattern }).sort({ updatedAt: -1 }),
    ]);

    res.json({
      folders: folders.map((f) => ({ id: f._id, name: f.name, parent: f.parent })),
      files: files.map((f) => ({
        id: f._id,
        name: f.originalName,
        type: f.type,
        sizeBytes: f.sizeBytes,
        updatedAt: f.updatedAt,
        folder: f.folder,
      })),
    });
  } catch (err) {
    res.status(500).json({ message: "Search failed", error: err.message });
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

// GET /api/storage/:id/view?download=1 (optional)
// Streams the file back with its real mime type. Content-Disposition
// is "inline" by default so images/PDFs/text render right in the tab;
// pass ?download=1 to force a save-as instead.
export async function viewFile(req, res) {
  try {
    const file = await StorageFile.findOne({ _id: req.params.id, user: req.user._id });
    if (!file) return res.status(404).json({ message: "File not found" });
    if (!fs.existsSync(file.path)) {
      return res.status(404).json({ message: "File is missing from storage" });
    }

    const disposition = req.query.download ? "attachment" : "inline";
    res.setHeader("Content-Type", file.mimeType || "application/octet-stream");
    res.setHeader(
      "Content-Disposition",
      `${disposition}; filename="${encodeURIComponent(file.originalName)}"`
    );
    fs.createReadStream(file.path).pipe(res);
  } catch (err) {
    res.status(500).json({ message: "Failed to load file", error: err.message });
  }
}

// PATCH /api/storage/:id  { name?, folderId? }
// Renames and/or moves a file. Either field is optional - only what's
// sent gets changed. folderId: null moves it to the storage root.
export async function updateFile(req, res) {
  try {
    const file = await StorageFile.findOne({ _id: req.params.id, user: req.user._id });
    if (!file) return res.status(404).json({ message: "File not found" });

    const { name, folderId } = req.body;

    if (name !== undefined) {
      if (!name.trim()) return res.status(400).json({ message: "File name can't be empty" });
      file.originalName = name.trim();
    }

    if (folderId !== undefined) {
      const { folderId: resolvedFolderId } = await resolveFolder(folderId, req.user._id);
      file.folder = resolvedFolderId;
    }

    await file.save();
    res.json({
      file: {
        id: file._id,
        name: file.originalName,
        type: file.type,
        sizeBytes: file.sizeBytes,
        updatedAt: file.updatedAt,
      },
    });
  } catch (err) {
    const status = err.status || 500;
    res.status(status).json({ message: err.message || "Failed to update file" });
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

// GET /api/storage/folders/tree
// Every folder the user owns, flat (id + name + parent) - lets the
// client build a "Move to..." picker without walking the tree one
// getStorageData call at a time.
export async function getFolderTree(req, res) {
  try {
    const folders = await Folder.find({ user: req.user._id }).sort({ name: 1 });
    res.json({
      folders: folders.map((f) => ({ id: f._id, name: f.name, parent: f.parent })),
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to load folders", error: err.message });
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

// PATCH /api/storage/folders/:id  { name?, parentId? }
// Renames and/or moves (reparents) a folder. Blocks moving a folder
// into itself or into one of its own descendants, which would create
// a cycle the tree could never recover from.
export async function updateFolder(req, res) {
  try {
    const folder = await Folder.findOne({ _id: req.params.id, user: req.user._id });
    if (!folder) return res.status(404).json({ message: "Folder not found" });

    const { name, parentId } = req.body;

    if (name !== undefined) {
      if (!name.trim()) return res.status(400).json({ message: "Folder name can't be empty" });
      folder.name = name.trim();
    }

    if (parentId !== undefined) {
      const { folderId: resolvedParentId } = await resolveFolder(parentId, req.user._id);

      if (resolvedParentId) {
        const descendantIds = (await collectFolderIds(folder._id, req.user._id)).map(String);
        if (descendantIds.includes(String(resolvedParentId))) {
          return res.status(400).json({ message: "Can't move a folder into itself or one of its own subfolders" });
        }
      }

      folder.parent = resolvedParentId;
    }

    await folder.save();
    res.json({ folder: { id: folder._id, name: folder.name, parent: folder.parent } });
  } catch (err) {
    const status = err.status || 500;
    res.status(status).json({ message: err.message || "Failed to update folder" });
  }
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