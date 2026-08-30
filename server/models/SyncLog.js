
import mongoose from "mongoose";

// One row per platform connect/reconnect/stats-update - the raw material
// for real streaks, "active this month", and achievements, instead of
// numbers nobody actually generated.
const syncLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    platform: { type: String, required: true },
    action: { type: String, enum: ["connect", "stats_update"], required: true },
  },
  { timestamps: true }
);

syncLogSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model("SyncLog", syncLogSchema);
