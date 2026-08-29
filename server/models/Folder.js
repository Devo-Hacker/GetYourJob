import mongoose from "mongoose";

const folderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "Folder", default: null },
  },
  { timestamps: true }
);

export default mongoose.model("Folder", folderSchema);
