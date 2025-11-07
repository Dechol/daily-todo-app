import TodoList from "@/components/TodoList";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import Todo from "@/models/Todo";
import { NextResponse } from "next/server";


// GET → get a project and its todos

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params

    const project = await Project.findById(id)
    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });
    return NextResponse.json(project);
  } catch (error) {
    console.error("GET /api/projects/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}

// PATCH → update project details, rename**

export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const { id } = await params
    const { name } = await req.json();
    console.log("id", id)
    console.log("name", name)

    const project = await Project.findByIdAndUpdate(id, { name }, { new: true });
    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

    return NextResponse.json(project);
  } catch (error) {
    console.error("PATCH /api/projects/[id] error:", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

// DELETE → delete project and related todos

export async function DELETE(req, { params }) {
  try {
    await connectDB();

    const { id } = await params


    // TODO UPDATE FILTER AND UPDATE ALL TODOS ONCE A PROJECT IS DELETED 
    // await Todo.deleteMany({ project: params.id });

    const p = await Project.findByIdAndDelete(id);
    console.log(p)

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/projects/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
