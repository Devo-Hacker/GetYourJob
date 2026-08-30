import RoadmapProgress from "../models/RoadmapProgress.js";

export const getRoadmap = async (req, res) => {
  try {
    let roadmap = await RoadmapProgress.findOne({ user: req.user._id });

    if (!roadmap) {
      roadmap = await RoadmapProgress.create({
        user: req.user._id,
        targetRole: "Full-Stack Developer",
        playlists: [
          {
            name: "React & Node.js Mastery",
            type: "folder",
            progress: 35,
            parentId: null,
          },
        ],
        dailyGoal: {
          streak: 0,
          tasks: [
            { label: "Watch a video or read a tutorial", done: 0, total: 1 },
            { label: "Practice coding for 30 minutes", done: 0, total: 1 },
            { label: "Solve 2 coding problems", done: 0, total: 2 },
          ],
        },
        phases: [
          {
            id: 1,
            title: "Foundation Building",
            status: "In Progress",
            tone: "indigo",
            description: "Strengthen core concepts.",
            skillsCount: 6,
            hours: 35,
            skills: ["JavaScript", "TypeScript"],
            progress: 45,
          },
        ],
      });
    }

    // Default first video inside initial folder if empty
    if (roadmap.playlists.length === 1 && roadmap.playlists[0].type === "folder") {
      roadmap.playlists.push({
        name: "Node.js Full Course",
        type: "video",
        url: "https://www.youtube.com/watch?v=Oe421EPjeBE",
        parentId: roadmap.playlists[0]._id.toString(),
      });
      await roadmap.save();
    }

    res.json(roadmap);
  } catch (error) {
    res.status(500).json({ message: "Error fetching roadmap data" });
  }
};

// Create a folder or video item
export const createPlaylistItem = async (req, res) => {
  const { name, type, url, parentId } = req.body;
  try {
    const roadmap = await RoadmapProgress.findOne({ user: req.user._id });
    if (!roadmap) return res.status(404).json({ message: "Roadmap not found" });

    roadmap.playlists.push({
      name,
      type: type || "folder",
      url: url || "",
      progress: 0,
      parentId: parentId || null,
    });

    await roadmap.save();
    res.json(roadmap);
  } catch (error) {
    res.status(500).json({ message: "Error creating playlist item" });
  }
};

// Update name, url, or progress of an item
export const updatePlaylistItem = async (req, res) => {
  const { id, name, url, progress } = req.body;
  try {
    const roadmap = await RoadmapProgress.findOne({ user: req.user._id });
    if (!roadmap) return res.status(404).json({ message: "Roadmap not found" });

    const item = roadmap.playlists.id(id);
    if (item) {
      if (name !== undefined) item.name = name;
      if (url !== undefined) item.url = url;
      if (progress !== undefined) item.progress = Math.min(100, Math.max(0, Number(progress)));
      await roadmap.save();
    }
    res.json(roadmap);
  } catch (error) {
    res.status(500).json({ message: "Error updating playlist item" });
  }
};

// Recursively delete an item and all its subcomponents
export const deletePlaylistItem = async (req, res) => {
  const { id } = req.params;
  try {
    const roadmap = await RoadmapProgress.findOne({ user: req.user._id });
    if (!roadmap) return res.status(404).json({ message: "Roadmap not found" });

    const idsToDelete = new Set([id]);
    let addedNew = true;

    while (addedNew) {
      addedNew = false;
      roadmap.playlists.forEach((item) => {
        if (item.parentId && idsToDelete.has(item.parentId) && !idsToDelete.has(item._id.toString())) {
          idsToDelete.add(item._id.toString());
          addedNew = true;
        }
      });
    }

    roadmap.playlists = roadmap.playlists.filter((item) => !idsToDelete.has(item._id.toString()));

    await roadmap.save();
    res.json(roadmap);
  } catch (error) {
    res.status(500).json({ message: "Error deleting playlist item" });
  }
};

export const updateDailyTask = async (req, res) => {
  const { taskId, completed } = req.body;
  try {
    const roadmap = await RoadmapProgress.findOne({ user: req.user._id });
    const task = roadmap.dailyGoal.tasks.id(taskId);
    if (task) {
      task.done = completed ? task.total : 0;
    }
    await roadmap.save();
    res.json(roadmap);
  } catch (error) {
    res.status(500).json({ message: "Error updating task" });
  }
};