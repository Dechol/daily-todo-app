import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import List from "@/models/List";

export async function POST(req) {
  await connectDB();

  const { email, password } = await req.json();
  const cookieStore = cookies();
  const guestId = await cookieStore.get("dailysGuestId")?.value;
  console.log("hereee", guestId)

  // 1️⃣ Find user
  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ error: "Invalid email" }, { status: 401 });
  }

  // 2️⃣ Verify password
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  // 3️⃣ If logged in as guest, migrate guest data
  if (guestId) {
    await List.updateMany(
      { anonId: guestId },
      { $set: { user: user._id }, $unset: { guestId: "" } }
    );
    await User.deleteOne({ anonId: guestId }); // optional cleanup
  }

  // 4️⃣ Set cookies
  const res = NextResponse.json({ success: true, user });
  res.cookies.delete("dailysGuestId");
  res.cookies.set("dailysGuestId", user._id.toString(), {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30, // 30 days
    sameSite: "lax",
    path: "/",
  });

  return res;
}
