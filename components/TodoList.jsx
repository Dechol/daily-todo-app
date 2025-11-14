"use client";
import { useEffect, useState } from "react";
import TodoItem from "./TodoItem";
import { useUser } from "@/context/UserContext";
import { useTodos } from "@/context/TodoContext";
import { useUI } from "@/context/UiContext";

export default function TodoList({ date }) {
  const user = useUser()
  const { data, setData, fetchData } = useTodos()
  const { hiddenProjects, toggleProjectVisibility } = useUI()

  // const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  // const [projects, setProjects] = useState([])
  const [editProjectName, setProjectName] = useState();
  // const [data, setData] = useState()
  // const [hiddenProjects, setHiddenProjects] = useState({});


  console.log(data)

  // Fetch todos whenever the date changes
  useEffect(() => {

    if(user.loading) return
    fetchData( date, user.user.anonId, user.user._id)

  }, [date, user]);


  // TODO FUNCTIONS 
  // make new todo 
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

    setData( prev=> ({
      ...prev,
      todos: [ ...prev.todos, data]
    }))

    setInput("");
  }

  // toggle todo completed 
  async function toggleTodo(todoId, projectId) {

    const res = await fetch(`/api/todos/${date}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-anon-id": user.user.anonId,
      },
      body: JSON.stringify({ todoId }),
    });
    const data = await res.json();

    // update state
    setData( prev=> {

      let newgoals = prev.goals.map( g => g._id === todoId? {...g, completed: !g.completed } : g )
      let newTodos = prev.todos;
      let newProjects = prev.projects;

      if ( projectId ){
        newProjects = newProjects.map( p => p._id === projectId? { ...p, todos: p.todos.map( pt => pt._id === todoId? { ...pt, completed: !pt.completed } : pt )} : p)
      }
      else {
        newTodos = newTodos.map( t => t._id === todoId? { ...t, completed: !t.completed } : t)
      }

      return {
        ...prev,
        goals: newgoals,
        projects: newProjects,
        todos: newTodos
      }
    })

  }

  // delete a todo 
  async function onDelete( todoId, projectId ){

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

    // update state 
    setData( prev => {

      let newGoals = prev.goals.filter( g => g._id !== todoId)
      let newProjects = prev.projects;
      let newTodos = prev.todos;

      if ( projectId ){
        newProjects = newProjects.map( p => p._id === projectId? { ...p, todos: p.todos.filter( pt => pt._id !== todoId)} : p )
      }
      if( !projectId ) {
        newTodos = newTodos.filter( t => t._id !== todoId)
      }

      return {
        ...prev,
        goals: newGoals,
        projects: newProjects,
        todos: newTodos
      }
    })
  }

  //edit the text of a todo
  async function onEdit(todoId, text, projectId){

    const res = await fetch(`/api/todos/${date}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-anon-id": user.user.anonId,
      },
      body: JSON.stringify({ todoId, text }),
    });

    // update state 
    setData( prev => {

      let newGoals = prev.goals.map( g => g._id === todoId? { ...g, text} : g )
      let newProjects = prev.projects;
      let newTodos = prev.todos;

      if ( !projectId ){
        newTodos = newTodos.map( t => t._id === todoId? { ...t, text } : t )
      } 
      if ( projectId ){
        newProjects = newProjects.map( p => p._id === projectId? { ...p, todos: p.todos.map( pt => pt._id === todoId? { ...pt, text } : pt )} : p )
      }

      return { 
        ...prev,
        goals: newGoals,
        projects: newProjects,
        todos: newTodos
      }
    })
  }

  // toggel todo as a goal 
  const handleGoal = async (todoId, projectId) => {

    console.log(todoId, projectId)
    const res = await fetch(`/api/todos/${date}/goal`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ todoId }),
    });

    const { todo } = await res.json();
    console.log(todo)

    // update state 
    setData( prev => {

      // update goals 
      const updatedGoals = todo.isGoal? [...prev.goals, todo] : prev.goals.filter( g => g._id !== todo._id)

      if( !projectId ){

        return{
          ...prev,
          goals: updatedGoals,
          todos: prev.todos.map( t => t._id === todoId? { ...t, isGoal: !t.isGoal } : t)
        }
      } else {

        return {
          ...prev,
          goals: updatedGoals,
          projects: prev.projects.map( p => 
            p._id !== projectId? 
              p : ({
                ...p,
                todos: p.todos.map( pt => pt._id === todoId ? {...pt, isGoal: !pt.isGoal } : pt)
              }
          ))  
        }
      }
    })
  };

  // change or remove project from todo 
  const onChangeProject = async(todoId, projectId, oldProjectId) => {

    const res = await fetch(`/api/todos/${date}/project`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ todoId, projectId }),
    });

    const { todo } = await res.json()

    // update state 
    setData( prev => {

      let newTodos = prev.todos;
      if ( !projectId ){
        newTodos = [ ...newTodos, todo]
      }
      if ( !oldProjectId ){
        newTodos = newTodos.filter( t => t._id !== todoId)
      }

      return {
        ...prev,
        projects: prev.projects.map( p => {

        // remove from old project
        if (p._id === oldProjectId) {
          return { ...p, todos: p.todos.filter(t => t._id !== todoId) };
        }

        // add to new project
        if (p._id === projectId) {
          return { ...p, todos: [...p.todos, todo] };
        }

        return p;
        }),
        todos: newTodos
      }
    })
  }

  // const completed = todos.filter(t => t.completed).length || 0;
  // const total = todos.length || 0;

  // PROJECT FUNCTIONS 
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

  // Cancel editing a project name
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

  // Save project name
  async function handleSaveProjectName(id, newName) {
    const res = await fetch(`/api/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName }),
    });

    const updated = await res.json();
    // console.log("updated", updated)

    // update state  
    if (res.ok){
      setData(prev => ({
        ...prev, // keep other keys: all, goals, regularTodos
        projects: prev.projects.map(p => p._id === id ? { ...p, isEditing: false, name: editProjectName } : p )
      }));
    }
  }

  // delete a project 
  async function handleDeleteProject(id){

    //delete from db
    const res = await fetch(`/api/projects/${id}`,{
      method: "DELETE"
    })

    const update = await res.json()
    // console.log("update", update)

    //remove from state
      if (res.ok){
      setData(prev => ({
        ...prev, // keep other keys: all, goals, regularTodos
        projects: prev.projects.filter(p => p._id !== id )
      }));
    }
  }

  // STATE ONLY 
  // toggleHideProject
//   function toggleHideProject(id) {
//   setHiddenProjects(prev => ({
//     ...prev,
//     [id]: !prev[id]
//   }));
// }

  const visibleProjects = data.projects?.filter(
    (p) => !hiddenProjects.includes(p._id)
  );



  return (
      
  <div className="max-w-xl mx-auto mt-6 space-y-6">

    <header className="text-center my-6">
    <h1 className="text-2xl font-bold">🧘 My Daily Tracker</h1>
    <p className="text-gray-500 text-sm">Plan your day, focus on what matters most.</p>
    {/* <p className="text-sm text-gray-500 mt-3">✅ {completed}/{total} tasks done</p> */}

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
                    onToggle={toggleTodo}
                    onDelete={onDelete}
                    onEdit={onEdit}
                    onGoal={handleGoal}
                    // projects={projects}
                    onChangeProject={onChangeProject}

                  />
                ))}
              </ul>
            </section>
          )}


          {/* PROJECT DATA SECTION  */}
          {visibleProjects && (
            <section >
              {visibleProjects.map( (p) => (

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

                          <button
                            onClick={() => toggleProjectVisibility(p._id)}
                            className="text-xs text-red-500 hover:underline"
                          >
                            {hiddenProjects[p._id] ? "Show" : "Hide"}
                          </button>

                          <button className="text-sm rounded shadow-sm bg-green-200 text-black px-2 py-1" onClick={() => startEdit(p._id, p.name, p)} >edit</button>
                          {/* <button className="text-sm rounded shadow-sm bg-green-200 text-black px-2 py-1" onClick={()=> setIsEditing(!isEditing)} >edit</button> */}

                          <button className="text-sm rounded shadow-sm bg-purple-200 text-black px-2 py-1" onClick={()=> handleDeleteProject(p._id)}>delete</button>
                        </div>
                      )}
                  </div>

                  {p.todos && p.todos.map((t) => (

                    <TodoItem
                      key={t._id}
                      todo={t}
                      onToggle={toggleTodo}
                      onDelete={onDelete}
                      onEdit={onEdit}
                      onGoal={handleGoal}
                      projects={data.projects}
                      onChangeProject={onChangeProject}
                    />
                  ))}

                </div>
              ))}
            </section>
          )}


          {/* TODOS DATA SECTION  */}
          <section className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
            <h2 className="font-semibold text-gray-700 mb-3">🗒️ Tasks</h2>
            {data.todos ? (
              <ul className="space-y-2">
                {data.todos.map((t) => (
                  <TodoItem
                    key={t._id}
                    todo={t}
                    onToggle={toggleTodo}
                    onDelete={onDelete}
                    onEdit={onEdit}
                    onGoal={handleGoal}
                    projects={data.projects}
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
