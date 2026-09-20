import fs from "fs";
import Project from "../models/Project.js";

export async function getProjects(req, res) {
  const projects = await Project.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ projects });
}

export async function createProject(req, res) {
  try {
    const { name, description, techStack, status, githubUrl, liveUrl, progress } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Project name is required" });
    }

    const project = await Project.create({
      user: req.user._id,
      name,
      description,
      techStack: techStack
        ? techStack.split(",").map((t) => t.trim()).filter(Boolean)
        : [],
      status: status || "In Progress",
      githubUrl,
      liveUrl,
      progress: progress ? Number(progress) : null,
      fileName: req.file?.originalname,
      filePath: req.file?.path,
    });

    res.status(201).json({ project });
  } catch (err) {
    res.status(500).json({ message: "Failed to create project", error: err.message });
  }
}

// PUT /api/projects/:id  (multipart/form-data, field name: "file" - optional)
// Only fields actually present in the request are updated - the client only
// sends non-empty fields, so leaving something untouched in the edit form
// won't wipe it out server-side.
export async function updateProject(req, res) {
  try {
    const project = await Project.findOne({ _id: req.params.id, user: req.user._id });
    if (!project) {
      // Clean up an already-written upload if the project doesn't exist/isn't theirs
      if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: "Project not found" });
    }

    const { name, description, techStack, status, githubUrl, liveUrl, progress } = req.body;

    if (name !== undefined) project.name = name;
    if (description !== undefined) project.description = description;
    if (techStack !== undefined) {
      project.techStack = techStack.split(",").map((t) => t.trim()).filter(Boolean);
    }
    if (status !== undefined) project.status = status;
    if (githubUrl !== undefined) project.githubUrl = githubUrl;
    if (liveUrl !== undefined) project.liveUrl = liveUrl;
    if (progress !== undefined) project.progress = progress ? Number(progress) : null;

    // Only swap the attached file if a new one came in - delete the old one
    // from disk first so we don't leak orphaned files.
    if (req.file) {
      if (project.filePath && fs.existsSync(project.filePath)) {
        fs.unlinkSync(project.filePath);
      }
      project.fileName = req.file.originalname;
      project.filePath = req.file.path;
    }

    await project.save();
    res.json({ project });
  } catch (err) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ message: "Failed to update project", error: err.message });
  }
}

export async function deleteProject(req, res) {
  const project = await Project.findOne({ _id: req.params.id, user: req.user._id });
  if (!project) return res.status(404).json({ message: "Project not found" });

  if (project.filePath && fs.existsSync(project.filePath)) {
    fs.unlinkSync(project.filePath);
  }

  await project.deleteOne();
  res.json({ message: "Deleted" });
}