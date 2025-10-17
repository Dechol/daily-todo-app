import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

const todoListSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: { type: String, required: true }, // e.g. "2025-10-08"
  todos: [todoSchema],
});

export default mongoose.models.TodoList ||
  mongoose.model("TodoList", todoListSchema);
