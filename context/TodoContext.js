"use client";
import { createContext, useContext, useState } from "react";

const TodoContext = createContext();

// EXAMPLE - TODO DATA STRUCTURE
//   const [data, setData] = useState({
//     all: [],
//     goals: [],
//     projects: [],
//     regularTodos: [],
//   });

export function TodoProvider({ children }) {
  const [data, setData] = useState({});


    async function fetchData(date, userAnonId, userId) {

        const [ todoRes, projectRes ] = await Promise.all([
        fetch(`/api/todos/${date}`, {
            headers: {
            "Content-Type": "application/json",
            "x-anon-id": userAnonId,
            },
        }),
        fetch(`/api/projects?user=${userId}`)
        ]);

        const [ todoData, projectData ] = await Promise.all([
        todoRes.json(),
        projectRes.json()        
        ])

        console.log("todoData", todoData)
        console.log("projectData", projectData)

        // organise data 
        const goals = todoData.filter(t => t.isGoal)
        const todosWithProjects = todoData.filter(t => t.project)
        const todosWithoutProjects = todoData.filter(t => !t.project)

        // organise todos with projects
        const projectsWithTodos = projectData.map( p=> ({
        ...p,
        todos: todosWithProjects.filter(t=> t.project === p._id)
        }))

        setData({
        all: todoData,
        goals,
        projects: projectsWithTodos,
        todos: todosWithoutProjects
        })
    }

  async function createProject( userId ){
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user: userId,
        name: "New Project",
        description: "Tasks for my app launch",
      }),
    });

    const data = await res.json()

    setData( prev => {

      return {
        ...prev,
        projects: [ ...prev.projects, data]
      }
    })
  }
  

  return (
    <TodoContext.Provider value={{ data, setData, fetchData, createProject }}>
      {children}
    </TodoContext.Provider>
  );
}

export function useTodos() {
  return useContext(TodoContext);
}
