import mongoose from "mongoose";

const storageFileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    folder: { type: mongoose.Schema.Types.ObjectId, ref: "Folder", default: null },
    originalName: { type: String, required: true },
    path: { type: String, required: true }, // where multer saved it on disk
    mimeType: { type: String, required: true },
    sizeBytes: { type: Number, required: true },
    type: {
      type: String,
      enum: ["document", "image", "video", "code", "other"],
      default: "other",
    },
  },
  { timestamps: true }
);

export default mongoose.model("StorageFile", storageFileSchema);
