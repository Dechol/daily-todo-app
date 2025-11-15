"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

export default function UserMenu() {
  const { user, logout } = useUser()
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const menuRef = useRef(null);

  const toggleMenu = () => setOpen((prev) => !prev);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  return (
    <div className="relative bg-red-200" ref={menuRef}>
      {/* Avatar button */}
      <button
        onClick={toggleMenu}
        className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden hover:opacity-90 transition"
      >
        {user?.avatar ? (
          <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
        ) : (
          <span className="font-semibold text-gray-700">{user?.name?.[0] || "DH"}</span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 mt-2 w-48 bg-white shadow-lg border rounded-lg p-2 z-50 animate-fade"
        >
          <div className="px-3 py-2 text-sm text-gray-500">
            My Account
          </div>

          <button
            onClick={() => router.push("/settings")}
            className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm"
          >
            Settings
          </button>

          <button
            onClick={logout}
            className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm text-red-600"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
