import { connectDB } from "@/lib/mongodb";
import List from "@/models/List";

// GET /api/todos/[date]
export async function GET(req, { params }) {
  await connectDB();
  const { date } = await params;
  let list = await List.findOne({ date });
  if (!list) {
    list = await List.create({ date, todos: [] });
  }
  return Response.json(list);
}

// POST /api/todos/[date]
export async function POST(req, { params }) {
  await connectDB();
   const { date } = await params;
   const { text } = await req.json();

  const list = await List.findOneAndUpdate(
    { date },
    { $push: { todos: { text } } },
    { new: true, upsert: true }
  );
  return Response.json(list);
}

// PATCH /api/todos/[date]
export async function PATCH(req, { params }) {
  await connectDB();
  const { date } = await params;
  const { todoId } = await req.json();

  const list = await List.findOne({ date });
  if (!list) return Response.json({ error: "Not found" }, { status: 404 });

  const todo = list.todos.id(todoId);
  if (!todo) return Response.json({ error: "Todo not found" }, { status: 404 });

  todo.completed = !todo.completed;
  await list.save();

  return Response.json(list);
}
