// /api/auth/guest.js
import { v4 as uuidv4 } from 'uuid';
import User from "@/models/User";
import { connectDB } from '@/lib/mongodb';

export async function POST(req) {
  await connectDB();
  const anonId = uuidv4();

  const guest = await User.create({ anonId, isGuest: true });
  console.log(guest)
  
  // Return session token or store anonId in cookie/localStorage
  return Response.json({ anonId });
}
