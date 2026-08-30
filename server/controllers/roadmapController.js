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
            progress: 35,
            videos: [
              { title: "Node.js Full Course", url: "https://www.youtube.com/watch?v=Oe421EPjeBE" }
            ]
          }
        ],
        dailyGoal: {
          streak: 0,
          tasks: [
            { label: "Watch a video or read a tutorial", done: 0, total: 1 },
            { label: "Practice coding for 30 minutes", done: 0, total: 1 },
            { label: "Solve 2 coding problems", done: 0, total: 2 }
          ]
        },
        phases: [
          { id: 1, title: "Foundation Building", status: "In Progress", tone: "indigo", description: "Strengthen core concepts.", skillsCount: 6, hours: 35, skills: ["JavaScript", "TypeScript"], progress: 45 },
          { id: 2, title: "Backend Development", status: "Upcoming", tone: "sky", description: "Build strong backend expertise.", skillsCount: 4, hours: 30, skills: ["Node.js", "Express.js"], progress: 0 }
        ]
      });
    }
    res.json(roadmap);
  } catch (error) {
    res.status(500).json({ message: "Error fetching roadmap data" });
  }
};

export const createPlaylistFolder = async (req, res) => {
  const { name, progress } = req.body;
  try {
    const roadmap = await RoadmapProgress.findOne({ user: req.user._id });
    roadmap.playlists.push({ name, progress: Number(progress) || 0, videos: [] });
    await roadmap.save();
    res.json(roadmap);
  } catch (error) {
    res.status(500).json({ message: "Error creating playlist folder" });
  }
};

export const addVideoToPlaylist = async (req, res) => {
  const { folderId, title, url } = req.body;
  try {
    const roadmap = await RoadmapProgress.findOne({ user: req.user._id });
    const folder = roadmap.playlists.id(folderId);
    if (folder) {
      folder.videos.push({ title, url });
      await roadmap.save();
    }
    res.json(roadmap);
  } catch (error) {
    res.status(500).json({ message: "Error adding video" });
  }
};

export const updateFolderProgress = async (req, res) => {
  const { folderId, progress } = req.body;
  try {
    const roadmap = await RoadmapProgress.findOne({ user: req.user._id });
    const folder = roadmap.playlists.id(folderId);
    if (folder) {
      folder.progress = Math.min(100, Math.max(0, Number(progress)));
      await roadmap.save();
    }
    res.json(roadmap);
  } catch (error) {
    res.status(500).json({ message: "Error updating folder progress" });
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