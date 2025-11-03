import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";
import { getUserFromRequest } from "@/lib/auth"; // optional helper if you have auth

// GET → get a project and its todos

// PATCH → update project details, rename**

// DELETE → delete project and related todos

import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";
import Todo from "@/models/Todo";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const project = await Project.findById(params.id).populate("todos");
    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });
    return NextResponse.json(project);
  } catch (error) {
    console.error("GET /api/projects/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const { id } = await params
    const { name } = await req.json();
    // console.log("updates", updates)

    const project = await Project.findByIdAndUpdate(id, { name }, { new: true });
    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

    return NextResponse.json(project);
  } catch (error) {
    console.error("PATCH /api/projects/[id] error:", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();

    // Remove related todos first
    await Todo.deleteMany({ project: params.id });
    await Project.findByIdAndDelete(params.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/projects/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
