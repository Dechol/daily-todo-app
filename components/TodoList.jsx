"use client";
import { useEffect, useState } from "react";
import TodoItem from "./TodoItem";
import { useUser } from "@/context/UserContext";

export default function TodoList({ date }) {
  const user = useUser()
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);

  
  // Fetch todos whenever the date changes
  useEffect(() => {
    
    if(user.loading) return
    console.log(user.user.anonId)
    
    async function fetchTodos() {
      setLoading(true);
      const res = await fetch(`/api/todos/${date}`, {
        headers: {
          "Content-Type": "application/json",
          "x-anon-id": user.user.anonId,
        },
      });
      const data = await res.json();
      console.log(data)
      // console.log(data.todos)
      
      setTodos(data || []);
      setLoading(false);
    }
    fetchTodos();
  }, [date, user]);

  async function addTodo(e) {
    e.preventDefault();
    if (!input.trim()) return;
    const res = await fetch(`/api/todos/${date}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-anon-id": user.user.anonId,
      },
      body: JSON.stringify({ text: input }),
    });
    const data = await res.json();
    console.log(data)
    setTodos((prev) => [...prev, data]);

    setInput("");
  }

  async function toggleTodo(todoId) {
    const res = await fetch(`/api/todos/${date}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-anon-id": user.user.anonId,
      },
      body: JSON.stringify({ todoId }),
    });
    const data = await res.json();
    console.log(data)
    setTodos((prev) =>
      prev.map((t) => (t._id === data._id ? data : t))
    );
  }

  async function onDelete(todoId){

    const res = await fetch(`/api/todos/${date}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-anon-id": user.user.anonId,
      },
      body: JSON.stringify({ todoId }),
    });
    const data = await res.json();
    console.log(data)
    setTodos((prev) =>
      prev.filter(t => t._id !== todoId)
    );
  }

  async function onEdit(todoId, text){

    const res = await fetch(`/api/todos/${date}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-anon-id": user.user.anonId,
      },
      body: JSON.stringify({ todoId, text }),
    });
    const data = await res.json();
    console.log(data)
    setTodos((prev) =>
      prev.map(t => t._id === data._id? data: t)
    );
  }


  return (
    <div>
      {/* Add Todo */}
      <form onSubmit={addTodo} className="flex mb-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 border rounded-l p-2 outline-none"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 rounded-r hover:bg-blue-600"
        >
          Add
        </button>
      </form>

      {/* Todo Items */}
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : todos.length === 0 ? (
        <p className="text-center text-gray-400">No todos for this day.</p>
      ) : (
        <ul className="space-y-2">
          {todos.map((todo) => (
            <TodoItem key={todo._id} todo={todo} onToggle={() => toggleTodo(todo._id)} onDelete={()=> onDelete(todo._id)} onEdit={onEdit}/>
          ))}
        </ul>
      )}
    </div>
  );
}
