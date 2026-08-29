import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    displayName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true, // stored as a bcrypt hash, never plain text
    },
    role: {
      type: String,
      default: "Aspiring Full-Stack Developer",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;