import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  skills: [
    {
      name: String,
      weight: { type: Number, default: 5 }, // 1-10 importance to this role
    },
  ],
});

export default mongoose.model("Role", roleSchema);
