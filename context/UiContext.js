"use client";
import { createContext, useContext, useState } from "react";

const UIContext = createContext();

export function UIProvider({ children }) {
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [hiddenProjects, setHiddenProjects] = useState([]);

  function toggleProjectVisibility(id) {
    console.log("hiddenProjects ", hiddenProjects)
    setHiddenProjects(prev =>
      prev.includes(id)
        ? prev.filter(p => p !== id)
        : [...prev, id]
    );
  }

  return (
    <UIContext.Provider
      value={{
        selectedProjectId,
        setSelectedProjectId,
        hiddenProjects,
        toggleProjectVisibility,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  return useContext(UIContext);
}
