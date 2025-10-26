// lib/auth.js
import { cookies } from "next/headers";
import { v4 as uuid } from "uuid";

export async function getUserId(req) {
  const cookieStore = cookies();
  let userId = cookieStore.get("userId")?.value;

  if (!userId) {
    userId = uuid();
    cookieStore.set("userId", userId, { path: "/", maxAge: 60 * 60 * 24 * 365 });
  }

  return userId;
}
