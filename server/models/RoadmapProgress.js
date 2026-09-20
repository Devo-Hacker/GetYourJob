import mongoose from "mongoose";

const playlistItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["folder", "video"], required: true },
  url: { type: String, default: "" },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  parentId: { type: String, default: null },
});

const taskSchema = new mongoose.Schema({
  label: { type: String, required: true },
  done: { type: Number, default: 0 },
  total: { type: Number, default: 1 },
});

const weeklyTaskSchema = new mongoose.Schema({
  label: { type: String, required: true },
  done: { type: Number, default: 0 },
  total: { type: Number, default: 1 },
  unit: { type: String, default: "tasks" },
});

const milestoneSchema = new mongoose.Schema({
  label: { type: String, required: true },
  progress: { type: Number, default: 0, min: 0, max: 100 },
});

const phaseSchema = new mongoose.Schema({
  id: Number,
  title: String,
  status: String,
  tone: String,
  description: String,
  skillsCount: Number,
  hours: Number,
  skills: [String],
  progress: { type: Number, default: 0, min: 0, max: 100 },
});

const roadmapProgressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    targetRole: { type: String, default: "Full-Stack Developer" },
    overallProgress: { type: Number, default: 0 },
    skillsToImprove: { type: Number, default: 10 },
    estimatedHours: { type: Number, default: 120 },
    difficulty: { type: String, default: "Moderate" },

    playlists: [playlistItemSchema],

    dailyGoal: {
      streak: { type: Number, default: 0 },
      tasks: [taskSchema],
    },

    weeklyGoal: {
      days: {
        type: [
          {
            label: String,
            done: Boolean,
          },
        ],
        default: [
          { label: "S", done: false },
          { label: "M", done: true },
          { label: "T", done: true },
          { label: "W", done: false },
          { label: "T", done: false },
          { label: "F", done: false },
          { label: "S", done: false },
        ],
      },
      tasks: [weeklyTaskSchema],
    },

    phases: [phaseSchema],

    milestones: [milestoneSchema],
  },
  { timestamps: true }
);

export default mongoose.model("RoadmapProgress", roadmapProgressSchema);