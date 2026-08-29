import mongoose from "mongoose";

// Adzuna is external and stateless from our side - we only persist the
// user's relationship to a job (saved / applied) plus a lightweight
// snapshot so we can still render the card later without re-querying
// Adzuna (and burning free-tier calls) just to show a saved-jobs list.
const savedJobSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    externalId: { type: String, required: true }, // Adzuna's job id

    status: {
      type: String,
      enum: ["saved", "applied"],
      default: "saved",
    },

    snapshot: {
      title: String,
      company: String,
      location: String,
      redirectUrl: String,
      salary: String,
      match: Number,
    },
  },
  { timestamps: true }
);

// One record per user+job - saving twice just updates it, applying
// after saving flips status rather than creating a duplicate row.
savedJobSchema.index({ user: 1, externalId: 1 }, { unique: true });

export default mongoose.model("SavedJob", savedJobSchema);
