import mongoose from "mongoose";

const playlistItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["folder", "video"], required: true },
  url: { type: String, default: "" },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  parentId: { type: String, default: null }, // Null for root level, or parent folder _id
});

const taskSchema = new mongoose.Schema({
  label: String,
  done: { type: Number, default: 0 },
  total: Number,
});

const roadmapProgressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    targetRole: { type: String, default: "Full-Stack Developer" },
    overallProgress: { type: Number, default: 28 },
    skillsToImprove: { type: Number, default: 10 },
    estimatedHours: { type: Number, default: 120 },
    difficulty: { type: String, default: "Moderate" },

    playlists: [playlistItemSchema],

    dailyGoal: {
      streak: { type: Number, default: 0 },
      lastActiveDate: { type: Date },
      tasks: [taskSchema],
    },

    weeklyGoal: {
      completed: { type: Number, default: 0 },
      total: { type: Number, default: 5 },
      days: [{ label: String, done: Boolean }],
      tasks: [{ label: String, done: Number, total: Number, unit: String }],
    },

    phases: [
      {
        id: Number,
        title: String,
        status: String,
        tone: String,
        description: String,
        skillsCount: Number,
        hours: Number,
        skills: [String],
        progress: Number,
      },
    ],

    milestones: [{ label: String, progress: Number }],
  },
  { timestamps: true }
);

export default mongoose.model("RoadmapProgress", roadmapProgressSchema);