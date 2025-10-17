// /api/auth/convert.js
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";

export async function POST(req) {
  await connectDB();
  const { anonId, email, password } = await req.json();
  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.findOneAndUpdate(
    { anonId },
    { email, passwordHash, isGuest: false },
    { new: true }
  );

  if (!user) return Response.json({ error: "Guest not found" }, { status: 404 });
  
  return Response.json({ success: true, user });
}
