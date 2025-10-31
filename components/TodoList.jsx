"use client";
import { useEffect, useState } from "react";
import TodoItem from "./TodoItem";
import { useUser } from "@/context/UserContext";

export default function TodoList({ date }) {
  const user = useUser()
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([])

  
  // Fetch todos whenever the date changes
  useEffect(() => {
    
    if(user.loading) return
    console.log(user.user)
    
    async function fetchTodos() {
      setLoading(true);
      const res = await fetch(`/api/todos/${date}`, {
        headers: {
          "Content-Type": "application/json",
          "x-anon-id": user.user.anonId,
        },
      });
      const data = await res.json();
      
      setTodos(data || []);
      setLoading(false);
    }

    async function fetchProjects(){

      const res = await fetch(`/api/projects?user=${user.user._id}`);
      const data = await res.json();
      console.log(data)
      setProjects(data)
    }

    fetchTodos();
    fetchProjects()
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

  const handleGoal = async (todoId) => {
    const res = await fetch(`/api/todos/${date}/goal`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ todoId }),
    });

    if (res.ok) {
      const { todo } = await res.json();
      console.log(todo)
      setTodos((prev) =>
        prev.map((t) => (t._id === todo._id ? { ...t, isGoal: todo.isGoal } : t))
      );
    }
  };

  const onChangeProject = async(todoId, projectId) => {
    const res = await fetch(`/api/todos/${date}/project`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ todoId, projectId }),
    });

    const data = await res.json()
    console.log("onChangeProject", data)


  }


  const goals = todos.filter((t) => t.isGoal);
  const regularTodos = todos.filter((t) => !t.isGoal);
  const completed = todos.filter(t => t.completed).length;
  const total = todos.length;


  return (
<div className="max-w-xl mx-auto mt-6 space-y-6">

  <header className="text-center my-6">
  <h1 className="text-2xl font-bold">🧘 My Daily Tracker</h1>
  <p className="text-gray-500 text-sm">Plan your day, focus on what matters most.</p>
  <p className="text-sm text-gray-500 mt-3">
  ✅ {completed}/{total} tasks done
</p>

</header>

  {/* Add Todo */}
  <form onSubmit={addTodo} className="flex shadow rounded-lg overflow-hidden">
    <input
      value={input}
      onChange={(e) => setInput(e.target.value)}
      placeholder="Add a new task..."
      className="flex-1 p-3 outline-none text-sm border-none focus:ring-0"
    />
    <button
      type="submit"
      className="bg-blue-600 text-white px-5 text-sm font-semibold hover:bg-blue-700 transition"
    >
      Add
    </button>
  </form>

  {/* Todo Sections */}
  {loading ? (
    <p className="text-center text-gray-500">Loading...</p>
  ) : (

    // GOALS SECTIONS
    <>
      {goals.length > 0 && (
        <section className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 shadow-sm">
          <h2 className="font-bold text-lg mb-3 text-yellow-800">🎯 Today’s Goals</h2>
          <ul className="space-y-2">
            {goals.map((t) => (
              <TodoItem
                key={t._id}
                todo={t}
                onToggle={() => toggleTodo(t._id)}
                onDelete={() => onDelete(t._id)}
                onEdit={onEdit}
                onGoal={handleGoal}
                projects={projects}
              />
            ))}
          </ul>
        </section>
      )}


      {/* PROJECTS SECTION  */}
      {projects.length > 0 && (
        <section >
          {projects.map((p, index) => (
            <div key={index} className="bg-red-50 border border-red-100 rounded-xl p-4 shadow-sm mb-6">
              <h2 className="font-bold text-lg mb-3 text-red-800">{p.icon} {p.name}</h2>

            </div>
          ))}
        </section>
      )}




      {/* REGULAR TODOS SECTION  */}
      <section className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
        <h2 className="font-semibold text-gray-700 mb-3">🗒️ Tasks</h2>
        {regularTodos.length > 0 ? (
          <ul className="space-y-2">
            {regularTodos.map((t) => (
              <TodoItem
                key={t._id}
                todo={t}
                onToggle={() => toggleTodo(t._id)}
                onDelete={() => onDelete(t._id)}
                onEdit={onEdit}
                onGoal={handleGoal}
                projects={projects}
                onChangeProject={onChangeProject}
              />
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 text-sm">No regular tasks today.</p>
        )}
      </section>
    </>
  )}
</div>
  );
}
