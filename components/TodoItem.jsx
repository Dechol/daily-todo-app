"use client";

import { useState } from "react";

export default function TodoItem({ todo, onToggle, onEdit, onDelete, onGoal, projects, onChangeProject }) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(todo.text);

  const handleSave = (e) => {
    e.preventDefault()
    if (text.trim() && text !== todo.text) {
      onEdit(todo._id, text, todo.project);
    }
    setIsEditing(false);
  };

  const handleChangeProject = (e) => {
    e.preventDefault()
    console.log(e.target.value)

    onChangeProject(todo._id, e.target.value, todo.project )

    // pass a onChangeProject function call here - to update db and state 
  }

  return (
    <li
      className={`flex justify-between items-center p-2 border rounded gap-2 ${
        todo.completed ? "bg-gray-100" : ""
      }`}
    >
      {isEditing ? (
        <input
          className="flex-1 border px-2 py-1 rounded outline-none"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") {
              setIsEditing(false);
              setText(todo.text);
            }
          }}
          autoFocus
        />
      ) : (
        <span
          className={`flex-1 cursor-pointer ${
            todo.completed ? "line-through text-gray-400" : ""
          }`}
          onClick={() => onToggle(todo._id, todo.project)}
        >
          {todo.text}
        </span>
      )}

      <div className="flex gap-2">
        {isEditing ? (
          <button
            onClick={handleSave}
            className="text-sm bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
          >
            Save
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm bg-yellow-200 text-yellow-800 px-2 py-1 rounded hover:bg-yellow-300"
          >
            Edit
          </button>
        )}

        <select id="selectProject" className="max-w-[20px]" onChange={handleChangeProject} defaultValue={todo.project || ""}>
          
          {projects && projects.map((p, i) => (
            <option key={i} value={p._id}>{p.name}</option>
            
          ))}
          <option value="" ></option>

        </select>

        <button
          onClick={() => onGoal(todo._id, todo.project)}
          className={`text-sm px-2 py-1 rounded ${
            todo.isGoal ? "bg-yellow-400 text-white" : "bg-gray-100"
          }`}
        >
          ⭐
        </button>

        <button
          onClick={() => onDelete( todo._id, todo.project )}
          className="text-sm bg-red-200 text-red-800 px-2 py-1 rounded hover:bg-red-300"
        >
          Delete
        </button>
      </div>
    </li>
  );
}
