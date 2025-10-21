"use client"

import { useUser } from "@/context/UserContext"
import Link from "next/link"

export default function Nav(){
    // const {user, loading } = useUser()
    const {user, loading} = useUser()
    console.log(user)

    if(loading) return <>loading...</>



    return(
          <header className="flex justify-between items-center p-4 bg-gray-50">
            {/* Left side: anonId (dev only) */}
            <div id="anon-id" className="text-xs text-gray-500 font-mono">{user.anonId}</div>

            {/* Right side: Sign In */}
            <Link
              href="/signin"
              className="px-3 py-1 text-sm bg-white text-black rounded hover:bg-blue-400 transition"
              >
              Sign In
            </Link>
          </header>
    )

}