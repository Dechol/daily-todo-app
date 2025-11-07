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
  const [isEditing, setIsEditing] = useState(false);
  const [editProjectName, setProjectName] = useState();
  const [data, setData] = useState()


  
  // Fetch todos whenever the date changes
  useEffect(() => {
    if(user.loading) return

    async function fetchData() {
      
      setLoading(true)

      const [ todoRes, projectRes ] = await Promise.all([

        fetch(`/api/todos/${date}`, {
          headers: {
            "Content-Type": "application/json",
            "x-anon-id": user.user.anonId,
          },
        }),

        fetch(`/api/projects?user=${user.user._id}`)
      ]);

      const [ todoData, projectData ] = await Promise.all([
        todoRes.json(),
        projectRes.json()        
      ])

      console.log("todoData", todoData)
      console.log("projectData", projectData)

      // setProjects(projectData)

      // organise data 
      const goals = todoData.filter(t => t.isGoal)
      const todosWithProjects = todoData.filter(t => t.project)
      const todosWithoutProjects = todoData.filter(t => !t.project)

      // const todosByProject = todoData.map()
      // const projects = projectData
      // organise projects 
      // const projectsWithTodos 

      setData({
        all: todoData,
        goals,
        projects: projectData,
        todos: todosWithoutProjects
      })

    }
    
    fetchData()
    
    async function fetchTodos() {
      setLoading(true);
      const res = await fetch(`/api/todos/${date}`, {
        headers: {
          "Content-Type": "application/json",
          "x-anon-id": user.user.anonId,
        },
      });
      const data = await res.json();
      console.log("todos", todos)
      
      setTodos(data || []);
      setLoading(false);
    }

    async function fetchProjects(){
      const res = await fetch(`/api/projects?user=${user.user._id}`);
      const data = await res.json();
      console.log("projects", projects)
      setProjects(data)
    }

    // fetchTodos();
    // fetchProjects()
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
    
    // update state
    
    // setTodos((prev) => [...prev, data]);

    setData( prev=> ({
      ...prev,
      todos: [ ...prev.todos, data]
    }))

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

    // update state
    // setTodos((prev) =>
    //   prev.map((t) => (t._id === data._id ? data : t))
    // );

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



  const todosWithProjects = todos.filter(t => t.project);
  const completed = todos.filter(t => t.completed).length;
  const total = todos.length;

  const todosByProject = projects.map(p => ({
    project: p,
    todos: todosWithProjects.filter(t => t.project === p._id)
  }))
  console.log("todosByProject", todosByProject)

  // Start editing a project name
  function startEdit(projectId, projectName) {

    setProjectName(projectName)

    setData(prev => ({
      ...prev, // keep other keys: all, goals, regularTodos
      projects: prev.projects.map(p =>
        p._id === projectId
          ? { ...p, isEditing: true }
          : p
      )
    }));
  }

// Cancel edit
function cancelEdit(projectId) {

  setData(prev => ({
  ...prev, // keep other keys: all, goals, regularTodos
  projects: prev.projects.map(p =>
    p._id === projectId
      ? { ...p, isEditing: false }
      : p
  )
  }));
}

// Save new project name
async function handleSaveProjectName(id, newName) {
  const res = await fetch(`/api/projects/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: newName }),
  });

  const updated = await res.json();
  console.log("updated", updated)

  // update state  
  if (res.ok){
    setData(prev => ({
      ...prev, // keep other keys: all, goals, regularTodos
      projects: prev.projects.map(p => p._id === id ? { ...p, isEditing: false, name: editProjectName } : p )
    }));
  }
}

async function handleDeleteProject(id){

  //delete from db
  const res = await fetch(`/api/projects/${id}`,{
    method: "DELETE"
  })

  const update = await res.json()
  console.log("update", update)

  //remove from state
    if (res.ok){
    setData(prev => ({
      ...prev, // keep other keys: all, goals, regularTodos
      projects: prev.projects.filter(p => p._id !== id )
    }));
  }
}


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
  {!data ? (
    <p className="text-center text-gray-500">Loading...</p>
  ) : (

    // GOALS SECTIONS
    <>
      {data.goals && (
        <section className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 shadow-sm">
          <h2 className="font-bold text-lg mb-3 text-yellow-800">🎯 Today’s Goals</h2>
          <ul className="space-y-2">
            {data.goals.map((t) => (
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
        </section>
      )}


      {/* PROJECTS SECTION  */}
      {/* {projects.length > 0 && (
        <section >
          {projects.map((p, index) => (
            <div key={index} className="bg-red-50 border border-red-100 rounded-xl p-4 shadow-sm mb-6 flex justify-between">
              <h2 className="font-bold text-lg mb-3 text-red-800">{p.icon} {p.name}</h2>
              <div className="flex gap-2">
                <button className="text-sm rounded shadow-sm bg-green-200 text-black px-2 py-1">edit</button>
                <button className="text-sm rounded shadow-sm bg-purple-200 text-black px-2 py-1">delete</button>

              </div>

            </div>
          ))}
        </section>
      )} */}

      {/* TODOSBY PROJECT SECTION  */}
      {data && (
        <section >
          {data.projects.map( (p) => (
            <div key={p._id} className="bg-red-50 border border-red-100 rounded-xl p-4 shadow-sm mb-6">

              {/* project details section - icon & name  */}
              <div className="flex justify-between">
                <h2 className="font-bold text-lg mb-3 text-red-800">{p.icon} 
                  
                  {p.isEditing? (

                    <input 
                      type="text"
                      value={editProjectName}
                      onChange={(e)=> setProjectName(e.target.value)}
                      autoFocus 
                    />

                  ) : p.name
                  }
                  
                </h2>

                  {p.isEditing? (

                    <div className="flex gap-2">
                      <button className="text-sm rounded shadow-sm bg-green-200 text-black px-2 py-1" onClick={()=> handleSaveProjectName(p._id, editProjectName)}>save</button>
                      {/* <button className="text-sm rounded shadow-sm bg-green-200 text-black px-2 py-1" onClick={()=> setIsEditing(!isEditing)} >save</button> */}

                      <button className="text-sm rounded shadow-sm bg-purple-200 text-black px-2 py-1" onClick={()=> cancelEdit(p._id)}>cancel</button>
                    </div>


                  ):(
                    
                    <div className="flex gap-2">
                      <button className="text-sm rounded shadow-sm bg-green-200 text-black px-2 py-1" onClick={() => startEdit(p._id, p.name, p)} >edit</button>
                      {/* <button className="text-sm rounded shadow-sm bg-green-200 text-black px-2 py-1" onClick={()=> setIsEditing(!isEditing)} >edit</button> */}

                      <button className="text-sm rounded shadow-sm bg-purple-200 text-black px-2 py-1" onClick={()=> handleDeleteProject(p._id)}>delete</button>
                    </div>
                  )}
              </div>

              {p.todos.length > 0 && p.todos.map((t, i) => (

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

            </div>
          ))}
        </section>
      )}


      {/* REGULAR TODOS SECTION  */}
      <section className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
        <h2 className="font-semibold text-gray-700 mb-3">🗒️ Tasks</h2>
        {data.todos ? (
          <ul className="space-y-2">
            {data.todos.map((t) => (
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
