import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, sparse: true },
  passwordHash: { type: String },
  isGuest: { type: Boolean, default: true },
  anonId: { type: String, unique: true }, // For guest users
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model("User", userSchema);
