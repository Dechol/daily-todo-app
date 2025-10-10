"use client";

export default function TodoItem({ todo, onToggle }) {
  return (
    <li
      className={`flex justify-between items-center p-2 border rounded ${
        todo.completed ? "bg-gray-100" : ""
      }`}
    >
      <span
        className={`flex-1 ${
          todo.completed ? "line-through text-gray-400" : ""
        }`}
      >
        {todo.text}
      </span>
      <button
        onClick={onToggle}
        className={`text-sm px-3 py-1 rounded ${
          todo.completed
            ? "bg-green-100 text-green-700 hover:bg-green-200"
            : "bg-gray-200 hover:bg-gray-300"
        }`}
      >
        {todo.completed ? "Undo" : "Done"}
      </button>
    </li>
  );
}
