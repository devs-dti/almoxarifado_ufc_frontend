"use client";
import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";

export default function AuthInit() {
  const fetchMe = useAuthStore((s) => s.fetchMe);

  useEffect(() => {
    // CHANGED: Removed the 'token' check. Since we use HttpOnly cookies now,
    // the browser will automatically include the session credentials in fetchMe().
    fetchMe().catch(() => {
      // opcional: handle error (logout, limpar estado, redirecionar)
    });
  }, [fetchMe]);

  return null;
}
