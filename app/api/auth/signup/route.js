// app/api/signup/route.js
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";

export async function POST(req) {
  await connectDB();
  const { email, password } = await req.json();

  if (!email || !password) {
    return Response.json({ error: "Missing email or password" }, { status: 400 });
  }

  const cookieStore = cookies();
  const guestId = cookieStore.get("dailysGuestId")?.value;

  let user;

  if (guestId) {
    // Try to find existing guest
    user = await User.findOne({ anonId: guestId });
  }

  // If not found (edge case), check if email already registered
  if (!user) {
    const existing = await User.findOne({ email });
    if (existing) {
      return Response.json({ error: "Email already in use" }, { status: 400 });
    }

    // Create new user from scratch (if no guest found)
    user = new User();
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Upgrade guest → full user
  user.email = email;
  user.passwordHash = hashedPassword;
  user.isGuest = false;
  await user.save();

  return Response.json({ user, message: "Account created successfully" });
}
