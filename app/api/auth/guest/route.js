import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";
import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";

export async function POST(req) {
  await connectDB();
  const cookieStore = await cookies();
  
  // Try to get guestId from cookies or request body
  const cookieGuestId = cookieStore.get("dailysGuestId")?.value;
  console.log("cookieGuestId", cookieGuestId)

  const { localGuestId } = await req.json()
  console.log("localGuestId", localGuestId)

  // const guestId = cookieGuestId || localGuestId;
  const guestId = localGuestId;
  console.log("guestId", guestId)


  // CASE 1: Returning guest
  if (guestId) {
    const existingUser = await User.findOne({ anonId: guestId });
    if (existingUser) {
      // Re-store cookie if it was missing
      cookieStore.set("dailysGuestId", guestId, {
        path: "/",
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 365 * 1000, // 1 year
      });
      return Response.json({ user: existingUser, type: "returning-guest" });
    }
  }

  // CASE 2: New guest
  const newGuest = await User.create({
    anonId: uuidv4(),
    guest: true,
  });

  cookieStore.set("dailysGuestId", newGuest.anonId, {
    path: "/",
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 365 * 1000, // 1 year
  });


    // CASE 3: Returning signed-up user (optional, future)
  // You’ll later replace this with your auth logic (NextAuth, JWT, etc.)


  return Response.json({ user: newGuest, type: "new-guest" });
}
