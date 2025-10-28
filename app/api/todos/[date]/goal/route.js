// app/api/todos/[date]/goal/route.js
import {connectDB} from "@/lib/mongodb";
import Todo from "@/models/Todo";

export async function PATCH(req, { params }) {
    try {  
        await connectDB();
        const { date } = await params;
        const { todoId } = await req.json();

        const todo = await Todo.findById( todoId );
        if (!todo) return Response.json({ error: "Todo not found" }, { status: 404 });

        // Toggle goal status
        todo.isGoal = !todo.isGoal;
        await todo.save();

        return Response.json({ success: true, todo });
    } catch(error) {
        console.log(error)
        return Response.json({ error });

    }
}
