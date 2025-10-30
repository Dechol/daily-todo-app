import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  name: { type: String, required: true },
  description: { type: String, default: "" },

  // optional deadline or time range
  startDate: { type: String, default: null }, // e.g. "2025-10-30"
  endDate: { type: String, default: null },

  // optional color or icon for UI grouping
  color: { type: String, default: "#3B82F6" }, // Tailwind blue-500 default
  icon: { type: String, default: "📁" },

  // automatically link back to todos
  todos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Todo" }],

  // metadata
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

projectSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Project || mongoose.model("Project", projectSchema);
