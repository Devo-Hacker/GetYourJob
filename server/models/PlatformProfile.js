import mongoose from "mongoose";

const platformProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    platform: {
      type: String,
      required: true,
      enum: ["github", "leetcode", "hackerrank", "geeksforgeeks", "codechef", "codeforces", "linkedin", "gitlab", "kaggle", "hackerearth"],
    },
    usernameOrUrl: { type: String, required: true },
    data: { type: mongoose.Schema.Types.Mixed, default: {} },
    lastSynced: Date,
  },
  { timestamps: true }
);

// One entry per platform per user - saving again just updates it.
platformProfileSchema.index({ user: 1, platform: 1 }, { unique: true });

export default mongoose.model("PlatformProfile", platformProfileSchema);
