"use client";
import TodoList from "@/components/TodoList";
import { useState } from "react";

export default function HomePage() {
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);

  function changeDate(offset) {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + offset);
    setSelectedDate(d.toISOString().split("T")[0]);
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 p-4">
      <div className="max-w-lg mx-auto mt-10 bg-white shadow-lg rounded-2xl p-6">
        <h1 className="text-3xl font-bold text-center mb-6">🗓 Daily Todo List</h1>

        {/* Date controls */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => changeDate(-1)}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
          >
            ← Prev
          </button>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border rounded p-2"
          />

          <button
            onClick={() => changeDate(1)}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
          >
            Next →
          </button>
        </div>

        {/* Todo List */}
        <TodoList date={selectedDate} />
      </div>
    </main>
  );
}
