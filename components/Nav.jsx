"use client"

import { useUser } from "@/context/UserContext"
import Link from "next/link"

export default function Nav(){
    // const {user, loading } = useUser()
    const {user, loading} = useUser()
    console.log(user)

    async function logout() {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });
      
      const data = await res.json();
      console.log("data", data)

      if (data.status === "logged_out") {
        // Optionally reload the page or redirect
        localStorage.removeItem("dailysGuestId")
        window.location.reload();
      }
    }

    if(loading) return <>loading...</>

    // Guest user 
    if(user.isGuest){ 
        return (
          <>
          <header className="flex justify-between items-center p-4 bg-gray-50">
            {/* Left side: anonId (dev only) */}
            <div id="anon-id" className="text-xs text-gray-500 font-mono">Welcome back guest, {user.anonId}</div>

              

            {/* Right side: Sign In */}
            <div>
              <Link
                href="/signup"
                className="px-3 py-1 text-sm bg-white text-black rounded hover:bg-blue-400 transition"
                >
                Sign Up
              </Link>
              <Link
                href="/login"
                className="px-3 py-1 text-sm bg-white text-black rounded hover:bg-blue-400 transition"
                >
                Log In
              </Link>
            </div>
          </header>
          
          <h1 className="text-3xl font-bold text-center text-black bg-gray-50">🗓 DAILYS</h1>

          </>
        )
    }

    // User logged in 
    return(
      <>
          <header className="flex justify-between items-center p-4 bg-gray-50">
            {/* Left side: anonId (dev only) */}
            <div id="anon-id" className="text-xs text-gray-500 font-mono">Welcome back, {user.email}</div>



            {/* Right side: Sign In */}
            <button onClick={logout} className="px-3 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700" > 
              Log out 
            </button>
          </header>

      </>

    )

}