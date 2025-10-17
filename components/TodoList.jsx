"use client";
import { useEffect, useState } from "react";
import TodoItem from "./TodoItem";

export default function TodoList({ date }) {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch todos whenever the date changes
  useEffect(() => {
    async function fetchTodos() {
      setLoading(true);
      const res = await fetch(`/api/todos/${date}`, {
        headers: {
          "Content-Type": "application/json",
          "x-anon-id": localStorage.getItem("guestId"),
        },
      });
      const data = await res.json();
      console.log(data)
      console.log(data.todos)

      setTodos(data.todos || []);
      setLoading(false);
    }
    fetchTodos();
  }, [date]);

  async function addTodo(e) {
    e.preventDefault();
    if (!input.trim()) return;
    const res = await fetch(`/api/todos/${date}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-anon-id": localStorage.getItem("guestId"),
      },
      body: JSON.stringify({ text: input }),
    });
    const data = await res.json();
    console.log(data)
    setTodos(data.todos);
    setInput("");
  }

  async function toggleTodo(id) {
    const res = await fetch(`/api/todos/${date}`, {
      method: "PATCH",
      body: JSON.stringify({ todoId: id }),
    });
    const data = await res.json();
    console.log(data)
    setTodos(data.todos);
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
            <TodoItem key={todo._id} todo={todo} onToggle={() => toggleTodo(todo._id)} />
          ))}
        </ul>
      )}
    </div>
  );
}
