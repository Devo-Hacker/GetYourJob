import RoadmapProgress from "../models/RoadmapProgress.js";

// Helper to dynamically recalculate overall progress
const recalculateOverallProgress = (roadmap) => {
  let totalSum = 0;
  let categories = 0;

  // 1. Phases Progress Average
  if (roadmap.phases && roadmap.phases.length > 0) {
    const phaseAvg = roadmap.phases.reduce((acc, p) => acc + (p.progress || 0), 0) / roadmap.phases.length;
    totalSum += phaseAvg;
    categories++;
  }

  // 2. Milestones Progress Average
  if (roadmap.milestones && roadmap.milestones.length > 0) {
    const milestoneAvg = roadmap.milestones.reduce((acc, m) => acc + (m.progress || 0), 0) / roadmap.milestones.length;
    totalSum += milestoneAvg;
    categories++;
  }

  // 3. Playlists Progress Average
  if (roadmap.playlists && roadmap.playlists.length > 0) {
    const folders = roadmap.playlists.filter((p) => p.type === "folder");
    if (folders.length > 0) {
      const folderAvg = folders.reduce((acc, f) => acc + (f.progress || 0), 0) / folders.length;
      totalSum += folderAvg;
      categories++;
    }
  }

  roadmap.overallProgress = categories > 0 ? Math.round(totalSum / categories) : 0;
};

export const getRoadmap = async (req, res) => {
  try {
    let roadmap = await RoadmapProgress.findOne({ user: req.user._id });

    if (!roadmap) {
      roadmap = await RoadmapProgress.create({
        user: req.user._id,
        targetRole: "Full-Stack Developer",
        playlists: [
          { name: "React & Node.js Mastery", type: "folder", progress: 35, parentId: null },
        ],
        dailyGoal: {
          streak: 3,
          tasks: [
            { label: "Watch a video or read a tutorial", done: 0, total: 1 },
            { label: "Practice coding for 30 minutes", done: 0, total: 1 },
            { label: "Solve 2 coding problems", done: 0, total: 2 },
          ],
        },
        weeklyGoal: {
          days: [
            { label: "S", done: false },
            { label: "M", done: true },
            { label: "T", done: true },
            { label: "W", done: false },
            { label: "T", done: false },
            { label: "F", done: false },
            { label: "S", done: false },
          ],
          tasks: [{ label: "Build 1 Full Project", done: 0, total: 1, unit: "projects" }],
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
          {
            id: 2,
            title: "Backend Development",
            status: "Upcoming",
            tone: "sky",
            description: "Build strong backend expertise.",
            skillsCount: 4,
            hours: 30,
            skills: ["Node.js", "Express.js"],
            progress: 10,
          },
        ],
        milestones: [
          { label: "Master Javascript Fundamentals", progress: 80 },
          { label: "Deploy first Full-Stack App", progress: 30 },
        ],
      });
    }

    recalculateOverallProgress(roadmap);
    await roadmap.save();
    res.json(roadmap);
  } catch (error) {
    res.status(500).json({ message: "Error fetching roadmap data" });
  }
};

/* --- Playlist Controllers --- */
export const createPlaylistItem = async (req, res) => {
  const { name, type, url, parentId } = req.body;
  try {
    const roadmap = await RoadmapProgress.findOne({ user: req.user._id });
    roadmap.playlists.push({ name, type: type || "folder", url: url || "", progress: 0, parentId: parentId || null });
    recalculateOverallProgress(roadmap);
    await roadmap.save();
    res.json(roadmap);
  } catch (error) {
    res.status(500).json({ message: "Error creating playlist item" });
  }
};

export const updatePlaylistItem = async (req, res) => {
  const { id, name, url, progress } = req.body;
  try {
    const roadmap = await RoadmapProgress.findOne({ user: req.user._id });
    const item = roadmap.playlists.id(id);
    if (item) {
      if (name !== undefined) item.name = name;
      if (url !== undefined) item.url = url;
      if (progress !== undefined) item.progress = Math.min(100, Math.max(0, Number(progress)));
      recalculateOverallProgress(roadmap);
      await roadmap.save();
    }
    res.json(roadmap);
  } catch (error) {
    res.status(500).json({ message: "Error updating playlist item" });
  }
};

export const deletePlaylistItem = async (req, res) => {
  const { id } = req.params;
  try {
    const roadmap = await RoadmapProgress.findOne({ user: req.user._id });
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
    recalculateOverallProgress(roadmap);
    await roadmap.save();
    res.json(roadmap);
  } catch (error) {
    res.status(500).json({ message: "Error deleting playlist item" });
  }
};

/* --- Daily Goals Controllers --- */
export const addDailyTask = async (req, res) => {
  const { label, total } = req.body;
  try {
    const roadmap = await RoadmapProgress.findOne({ user: req.user._id });
    roadmap.dailyGoal.tasks.push({ label, done: 0, total: Number(total) || 1 });
    await roadmap.save();
    res.json(roadmap);
  } catch (error) {
    res.status(500).json({ message: "Error adding daily task" });
  }
};

export const updateDailyTask = async (req, res) => {
  const { taskId, completed, done, total, label } = req.body;
  try {
    const roadmap = await RoadmapProgress.findOne({ user: req.user._id });
    const task = roadmap.dailyGoal.tasks.id(taskId);
    if (task) {
      if (completed !== undefined) task.done = completed ? task.total : 0;
      if (done !== undefined) task.done = Math.min(task.total, Math.max(0, Number(done)));
      if (total !== undefined) task.total = Number(total);
      if (label !== undefined) task.label = label;
    }
    await roadmap.save();
    res.json(roadmap);
  } catch (error) {
    res.status(500).json({ message: "Error updating daily task" });
  }
};

export const deleteDailyTask = async (req, res) => {
  const { taskId } = req.params;
  try {
    const roadmap = await RoadmapProgress.findOne({ user: req.user._id });
    roadmap.dailyGoal.tasks = roadmap.dailyGoal.tasks.filter((t) => t._id.toString() !== taskId);
    await roadmap.save();
    res.json(roadmap);
  } catch (error) {
    res.status(500).json({ message: "Error deleting daily task" });
  }
};

export const updateStreak = async (req, res) => {
  const { streak } = req.body;
  try {
    const roadmap = await RoadmapProgress.findOne({ user: req.user._id });
    roadmap.dailyGoal.streak = Number(streak) || 0;
    await roadmap.save();
    res.json(roadmap);
  } catch (error) {
    res.status(500).json({ message: "Error updating streak" });
  }
};

/* --- Weekly Goals Controllers --- */
export const toggleWeeklyDay = async (req, res) => {
  const { dayIndex } = req.body;
  try {
    const roadmap = await RoadmapProgress.findOne({ user: req.user._id });
    if (roadmap.weeklyGoal.days[dayIndex]) {
      roadmap.weeklyGoal.days[dayIndex].done = !roadmap.weeklyGoal.days[dayIndex].done;
    }
    await roadmap.save();
    res.json(roadmap);
  } catch (error) {
    res.status(500).json({ message: "Error toggling day" });
  }
};

export const addWeeklyTask = async (req, res) => {
  const { label, total, unit } = req.body;
  try {
    const roadmap = await RoadmapProgress.findOne({ user: req.user._id });
    roadmap.weeklyGoal.tasks.push({ label, done: 0, total: Number(total) || 1, unit: unit || "tasks" });
    await roadmap.save();
    res.json(roadmap);
  } catch (error) {
    res.status(500).json({ message: "Error adding weekly task" });
  }
};

export const updateWeeklyTask = async (req, res) => {
  const { taskId, done, total, label } = req.body;
  try {
    const roadmap = await RoadmapProgress.findOne({ user: req.user._id });
    const task = roadmap.weeklyGoal.tasks.id(taskId);
    if (task) {
      if (done !== undefined) task.done = Math.min(task.total, Math.max(0, Number(done)));
      if (total !== undefined) task.total = Number(total);
      if (label !== undefined) task.label = label;
    }
    await roadmap.save();
    res.json(roadmap);
  } catch (error) {
    res.status(500).json({ message: "Error updating weekly task" });
  }
};

export const deleteWeeklyTask = async (req, res) => {
  const { taskId } = req.params;
  try {
    const roadmap = await RoadmapProgress.findOne({ user: req.user._id });
    roadmap.weeklyGoal.tasks = roadmap.weeklyGoal.tasks.filter((t) => t._id.toString() !== taskId);
    await roadmap.save();
    res.json(roadmap);
  } catch (error) {
    res.status(500).json({ message: "Error deleting weekly task" });
  }
};

/* --- Milestones Controllers --- */
export const addMilestone = async (req, res) => {
  const { label, progress } = req.body;
  try {
    const roadmap = await RoadmapProgress.findOne({ user: req.user._id });
    roadmap.milestones.push({ label, progress: Number(progress) || 0 });
    recalculateOverallProgress(roadmap);
    await roadmap.save();
    res.json(roadmap);
  } catch (error) {
    res.status(500).json({ message: "Error adding milestone" });
  }
};

export const updateMilestone = async (req, res) => {
  const { milestoneId, label, progress } = req.body;
  try {
    const roadmap = await RoadmapProgress.findOne({ user: req.user._id });
    const milestone = roadmap.milestones.id(milestoneId);
    if (milestone) {
      if (label !== undefined) milestone.label = label;
      if (progress !== undefined) milestone.progress = Math.min(100, Math.max(0, Number(progress)));
      recalculateOverallProgress(roadmap);
      await roadmap.save();
    }
    res.json(roadmap);
  } catch (error) {
    res.status(500).json({ message: "Error updating milestone" });
  }
};

export const deleteMilestone = async (req, res) => {
  const { milestoneId } = req.params;
  try {
    const roadmap = await RoadmapProgress.findOne({ user: req.user._id });
    roadmap.milestones = roadmap.milestones.filter((m) => m._id.toString() !== milestoneId);
    recalculateOverallProgress(roadmap);
    await roadmap.save();
    res.json(roadmap);
  } catch (error) {
    res.status(500).json({ message: "Error deleting milestone" });
  }
};

/* --- Roadmap Header & Stats Settings --- */
export const updateRoadmapStats = async (req, res) => {
  const { targetRole, skillsToImprove, estimatedHours, difficulty } = req.body;
  try {
    const roadmap = await RoadmapProgress.findOne({ user: req.user._id });
    if (targetRole !== undefined) roadmap.targetRole = targetRole;
    if (skillsToImprove !== undefined) roadmap.skillsToImprove = Number(skillsToImprove);
    if (estimatedHours !== undefined) roadmap.estimatedHours = Number(estimatedHours);
    if (difficulty !== undefined) roadmap.difficulty = difficulty;
    await roadmap.save();
    res.json(roadmap);
  } catch (error) {
    res.status(500).json({ message: "Error updating roadmap stats" });
  }
};