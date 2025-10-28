// models/Todo.js
import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
  isGoal: { type: Boolean, default: false }, // ✅ NEW

  // Calendar link
  date: { type: String }, // e.g. "2025-10-25" (ISO string for simplicity)

  // Project link (optional)
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", default: null },

  // Meta
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Todo || mongoose.model("Todo", todoSchema);
