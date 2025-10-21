"use client"

import { useUser } from "@/context/UserContext"
import Link from "next/link"

export default function Nav(){
    // const {user, loading } = useUser()
    const {user, loading} = useUser()
    console.log(user)

    if(loading) return <>loading...</>

    if(user.isGuest){ 
        return (
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
              href="/signin"
              className="px-3 py-1 text-sm bg-white text-black rounded hover:bg-blue-400 transition"
              >
              Sign In
            </Link>
            </div>
          </header>

        )
    }





    return(
          <header className="flex justify-between items-center p-4 bg-gray-50">
            {/* Left side: anonId (dev only) */}
            <div id="anon-id" className="text-xs text-gray-500 font-mono">Welcome back, {user.email}</div>

            {/* Right side: Sign In */}
            <div>
            <Link
              href="/signin"
              className="px-3 py-1 text-sm bg-white text-black rounded hover:bg-blue-400 transition"
              >
              Sign Out
            </Link>
            </div>
          </header>
    )

}