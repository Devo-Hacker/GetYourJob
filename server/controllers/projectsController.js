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

export async function deleteProject(req, res) {
  const project = await Project.findOne({ _id: req.params.id, user: req.user._id });
  if (!project) return res.status(404).json({ message: "Project not found" });

  if (project.filePath && fs.existsSync(project.filePath)) {
    fs.unlinkSync(project.filePath);
  }

  await project.deleteOne();
  res.json({ message: "Deleted" });
}
