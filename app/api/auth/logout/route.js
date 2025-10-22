import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST() {
  await connectDB();
  const cookieStore = cookies();

  // 1️⃣ Remove user cookie if present
  const userCookie = cookieStore.get("dailysGuestId");
  if (userCookie) {
    cookieStore.delete("dailysGuestId");
  }

  // 2️⃣ Create a new guest
  const newGuestId = uuidv4();
  const newGuest = await User.create({ anonId: newGuestId });

  // 3️⃣ Set new guest cookie
  const res = NextResponse.json({
    status: "logged_out",
    user: newGuest,
  });

  res.cookies.set("dailysGuestId", newGuestId, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: "lax",
    path: "/",
  });

  return res;
}
