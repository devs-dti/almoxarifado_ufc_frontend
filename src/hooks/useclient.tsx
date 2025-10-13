"use client";
import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";

export default function AuthInit() {
  const fetchMe = useAuthStore((s) => s.fetchMe);

  useEffect(() => {
    fetchMe().catch(() => {
      // opcional: handle error (logout, limpar token, redirecionar)
    });
  }, [fetchMe]);

  return null;
}
