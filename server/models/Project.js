import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    description: { type: String, default: "" },
    techStack: [{ type: String }],
    status: { type: String, enum: ["Completed", "In Progress", "Planned"], default: "In Progress" },
    githubUrl: String,
    liveUrl: String,
    fileName: String,
    filePath: String,
    progress: { type: Number, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
