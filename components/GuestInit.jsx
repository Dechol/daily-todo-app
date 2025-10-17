// components/GuestInit.js
"use client";
import { useEffect, useState } from "react";

export default function GuestInit() {
  const [anonId, setAnonId] = useState(null);

  useEffect(() => {
    let stored = localStorage.getItem("guestId");

    async function initGuest() {
      if (!stored) {
        const res = await fetch("/api/auth/guest", { method: "POST" });
        const data = await res.json();
        localStorage.setItem("guestId", data.anonId);
        stored = data.anonId;
      }
      setAnonId(stored);
      const el = document.getElementById("anon-id");
      if (el) el.textContent = `Guest ID: ${stored}`;
    }

    initGuest();
  }, []);

  return null; // no UI, just initializes and updates header
}
