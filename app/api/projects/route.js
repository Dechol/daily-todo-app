import { NextResponse } from "next/server";
import {connectDB} from "@/lib/mongodb";
import Project from "@/models/Project";
import { getUserFromRequest } from "@/lib/auth"; // optional helper if you have auth

// GET → fetch all projects for a user
// POST → create a new project

export async function GET(req) {
  try {
    await connectDB();

    // Example: extract userId from query or auth
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("user");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const projects = await Project.find({ user: userId }).sort({ createdAt: -1 });
    return NextResponse.json(projects);
  } catch (error) {
    console.error("GET /api/projects error:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { name, description, color, icon, user } = body;

    if (!name || !user) {
      return NextResponse.json({ error: "Missing name or user" }, { status: 400 });
    }

    const project = await Project.create({
      name,
      description,
      color,
      icon,
      user,
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("POST /api/projects error:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
