// app/api/todos/[date]/route.js
import { NextResponse } from "next/server";
import Todo from "@/models/Todo";
import { getUserId } from "@/lib/auth"; // we'll define this helper below
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(req, { params }) {
  try{
    await connectDB();
    // const userId = await getUserId(req);
    const userId = req.headers.get("x-anon-id"); // or cookie/JWT later
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    console.log("userId", userId)
  
    const { date } = await params;
  

    const user = await User.findOne({anonId: userId})
  
    const todos = await Todo.find({ user: user._id, date }).sort({ createdAt: 1 });
  
    return NextResponse.json(todos);

  } catch(err){
    console.log(err)
    return NextResponse.json(err);

  }

}

export async function POST(req, { params }) {
  try{

    await connectDB();
    
    // const userId = await getUserId(req);
    const userId = req.headers.get("x-anon-id"); // or cookie/JWT later

    const { date } = params;
    
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    const { text } = await req.json();

    if (!text) return NextResponse.json({ error: "Todo not found" }, { status: 401 });

    const user = await User.findOne({anonId: userId})
    console.log("user", user)
    
    const todo = await Todo.create({
      user: user._id,
      text,
      date,
    });
    
    return NextResponse.json(todo, { status: 201 });
  } catch(error){

    console.log(error)
    return NextResponse.json(error, { status: 400 });

  }
}
