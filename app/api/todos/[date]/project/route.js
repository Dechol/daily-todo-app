// app/api/todos/[date]/goal/route.js
import {connectDB} from "@/lib/mongodb";
import Todo from "@/models/Todo";
import { NextResponse } from "next/server";

export async function PATCH(req) {
    try {  
        await connectDB();
        const { todoId, projectId } = await req.json();

        const todo = await Todo.findById( todoId );
        if (!todo) return NextResponse.json({ error: "Todo not found" }, { status: 404 });

        // Toggle goal status
        todo.project = projectId || null
        await todo.save();

        return NextResponse.json({ success: true, todo });
    } catch(error) {
        console.log(error)
        return NextResponse.json({ success: false, error: "server error" }, { status: 500 });

    }
}
