"use client";
import { useState } from "react";
import { useUser } from "@/context/UserContext";

export default function SignUpPage() {
  const { user, setUser, loading } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    setStatus("Loading...");

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      setStatus("✅ Account created!");
      console.log("User upgraded:", data.user);
      setUser(data.user)
    } else {
      setStatus(`❌ ${data.error}`);
    }
  };

  if (loading) return null;

  return (
    <form onSubmit={handleSignUp} className="p-4 space-y-3 max-w-sm">
      <h2 className="text-xl font-semibold">
        {user?.isGuest ? "Create your account" : "You're already signed in"}
      </h2>

      {user?.isGuest && (
        <>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded w-full"
          >
            Sign Up
          </button>
        </>
      )}

      <p>{status}</p>
    </form>
  );
}
