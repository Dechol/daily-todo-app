import { connectDB } from "@/lib/mongodb";
import List from "@/models/List";
import User from "@/models/User";

// GET /api/todos/[date]
export async function GET(req, { params }) {
  await connectDB();
  const { date } = await params;

  const anonId = req.headers.get("x-anon-id"); // or cookie/JWT later

  const user = await User.findOne({ anonId });
  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  let list = await List.findOne({ user: user._id, date });
  if (!list) {
    list = await List.create({ user: user._id, date, todos: [] });
  }
  return Response.json(list);
}

// POST /api/todos/[date]
export async function POST(req, { params }) {
  try{
    await connectDB();
    const { date } = await params;
    const anonId = req.headers.get("x-anon-id");
    const { text } = await req.json();

    if (!date) {
      return Response.json({ error: "Missing date" }, { status: 400 });
    }
    if (!anonId) {
      return Response.json({ error: "Missing anonId header" }, { status: 400 });
    }
    if (!text) {
      return Response.json({ error: "Missing text" }, { status: 400 });
    }
    
    const user = await User.findOne({ anonId });
    
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }
    
    const list = await List.findOneAndUpdate(
      { user: user._id, date },
      { $push: { todos: { text } } },
      { new: true, upsert: true }
    );

    console.log("HIT API ROUTE", list)

    return Response.json(list);
  } catch (error){
    console.error("❌ API ERROR:", error);

    return Response.json({error:"failed to post todo"}, {status: 400});
  }
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
