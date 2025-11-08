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
  const [data, setData] = useState(null);



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


  // 🔹 Add helper functions here (optional)
  function addTodo(todo) {
    setData((prev) => ({
      ...prev,
      all: [...prev.all, todo],
      regularTodos: [...prev.regularTodos, todo],
    }));
  }

  function updateProjectName(projectId, newName) {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) =>
        p._id === projectId ? { ...p, name: newName } : p
      ),
    }));
  }



  

  return (
    <TodoContext.Provider value={{ data, setData, fetchData, addTodo, updateProjectName }}>
      {children}
    </TodoContext.Provider>
  );
}

export function useTodos() {
  return useContext(TodoContext);
}
