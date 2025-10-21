"use client";

import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initUser = async () => {
      try {
        const localGuestId = localStorage.getItem("dailysGuestId");
        
        const res = await fetch("/api/auth/guest", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ localGuestId }),
        });
        
        const data = await res.json();
        
        console.log(data)


        if (data?.user?.anonId) {
          localStorage.setItem("dailysGuestId", data.user.anonId);
          setUser(data.user);
        }

        setLoading(false);
      } catch (err) {
        console.error("Failed to initialize user:", err);
        setLoading(false);
      }
    };

    initUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
