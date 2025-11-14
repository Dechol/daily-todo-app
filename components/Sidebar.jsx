"use client";

import { useTodos } from "@/context/TodoContext";
import { Plus, ListTodo, Folder } from "lucide-react";

export default function Sidebar({ onNewProject, onNewTodo, onSelectProject }) {
  const { data } = useTodos();
  const projects = data?.projects || [];

  return (
    <aside className="w-64 h-full bg-white border-r shadow-sm p-4 flex flex-col">
      
      {/* Title */}
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Projects</h2>

      {/* Project List */}
      <div className="flex-1 overflow-y-auto">
        {projects.length === 0 && (
          <p className="text-gray-500 text-sm">No projects found</p>
        )}

        <ul className="space-y-1">
          {projects.map((project) => (
            <li key={project._id}>
              <button
                onClick={() => onSelectProject?.(project)}
                className="
                  w-full flex items-center gap-2
                  text-left text-gray-800
                  p-2 rounded-lg
                  hover:bg-gray-100
                "
              >
                <Folder className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium">{project.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 space-y-2">
        <button
          onClick={onNewProject}
          className="
            flex items-center justify-between
            w-full px-3 py-2
            bg-blue-600 text-white text-sm font-medium
            rounded-lg hover:bg-blue-700
          "
        >
          <span>New Project</span>
          <Plus className="h-4 w-4" />
        </button>

        <button
          onClick={onNewTodo}
          className="
            flex items-center justify-between
            w-full px-3 py-2
            border border-gray-300
            text-gray-800 text-sm font-medium
            rounded-lg hover:bg-gray-50
          "
        >
          <span>New Todo</span>
          <ListTodo className="h-4 w-4" />
        </button>
      </div>
    </aside>
  );
}
