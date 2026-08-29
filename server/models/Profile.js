import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },

    targetRole: { type: String, default: "Full-Stack Developer" },

    // Skills the user is manually targeting/learning toward - separate from
    // skills detected from resume or GitHub activity.
    desiredSkills: { type: [String], default: [] },

    // Every skill knows where it came from, so re-syncing one source
    // (e.g. re-uploading a resume) only replaces that source's skills.
    skills: [
      {
        name: String,
        proficiency: { type: Number, min: 0, max: 1, default: 0 }, // 0-1
        source: {
          type: String,
          enum: ["resume", "github", "manual"],
          default: "manual",
        },
      },
    ],

    resume: {
      fileName: String,
      uploadedAt: Date,
      parsedText: String,
    },

    experience: [{ title: String, company: String, duration: String }],
    education: [{ degree: String, institution: String, year: String }],
    projects: [{ name: String, description: String }],
  },
  { timestamps: true }
);

export default mongoose.model("Profile", profileSchema);
