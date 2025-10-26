// app/api/todos/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Todo from "@/models/Todo";
import { getUserId } from "@/lib/auth";

export async function GET(req) {
  await connectDB();
  const userId = await getUserId(req);

  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const todos = await Todo.find({ user: userId }).sort({ createdAt: -1 });
  return NextResponse.json(todos);
}

export async function POST(req) {
  await connectDB();
  const userId = await getUserId(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { text, date, project } = await req.json();
  const todo = await Todo.create({ user: userId, text, date, project });
  return NextResponse.json(todo, { status: 201 });
}
