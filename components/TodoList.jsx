"use client";
import { useEffect, useState } from "react";

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0] // e.g. 2025-10-08
  );
  const [input, setInput] = useState("");

  useEffect(() => {
    fetch(`/api/todos/${date}`).then(async (res) => {
      const data = await res.json();
      setTodos(data.todos);
    });
  }, [date]);

  async function addTodo(e) {
    e.preventDefault();
    if (!input.trim()) return;
    const res = await fetch(`/api/todos/${date}`, {
      method: "POST",
      body: JSON.stringify({ text: input }),
    });
    const data = await res.json();
    setTodos(data.todos);
    setInput("");
  }

  async function toggleTodo(id) {
    const res = await fetch(`/api/todos/${date}`, {
      method: "PATCH",
      body: JSON.stringify({ todoId: id }),
    });
    const data = await res.json();
    setTodos(data.todos);
  }

  function goToPrevDay() {
    const d = new Date(date);
    d.setDate(d.getDate() - 1);
    setDate(d.toISOString().split("T")[0]);
  }

  function goToNextDay() {
    const d = new Date(date);
    d.setDate(d.getDate() + 1);
    setDate(d.toISOString().split("T")[0]);
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">{date}</h1>

      <form onSubmit={addTodo} className="flex gap-2 mb-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add new todo..."
          className="border p-2 flex-1"
        />
        <button className="bg-blue-500 text-white px-4 rounded">Add</button>
      </form>

      <ul>
        {todos.map((todo) => (
          <li
            key={todo._id}
            className="flex justify-between items-center border-b py-2"
          >
            <span
              className={todo.completed ? "line-through text-gray-400" : ""}
            >
              {todo.text}
            </span>
            <button
              onClick={() => toggleTodo(todo._id)}
              className="text-sm text-blue-500"
            >
              {todo.completed ? "Undo" : "Done"}
            </button>
          </li>
        ))}
      </ul>

      <div className="flex justify-between mt-6">
        <button onClick={goToPrevDay}>← Prev</button>
        <button onClick={goToNextDay}>Next →</button>
      </div>
    </div>
  );
}
