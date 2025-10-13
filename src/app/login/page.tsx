"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "@/store/useAuthStore";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const schema = z.object({
  email: z.string().email("invalid email address"),
  password: z
    .string()
    .min(6, "password must be at least 6 characters long"),
});
type formData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState } =
    useForm<formData>({
      resolver: zodResolver(schema),
    });

  async function onSubmit(data: formData) {
    setError(null);
    try {
      await login({
        email: data.email,
        password: data.password,
      });
      router.push("/dashboard");
    } catch (err: unknown) {
      let message =
        "An unexpected error occurred. Please try again.";
      if (err instanceof Error) {
        message = err.message || message;
      } else if (axios.isAxiosError(err)) {
        const data = err.response?.data as
          | { message?: unknown }
          | undefined;
        if (data && typeof data.message === "string") {
          message = data.message;
        } else if (typeof err.message === "string") {
          message = err.message;
        }
      }
      setError(message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md"
      >
        <h1 className="text-xl font-semibold mb-4 text-center">
          Entrar
        </h1>

        <label className="block text-sm mb-1">Email</label>
        <Input
          {...register("email")}
          type="email"
          className="mb-2"
        />

        <label className="block text-sm mb-1">Senha</label>
        <Input
          {...register("password")}
          type="password"
          className="mb-3"
        />

        {error && <p className="text-sm mb-1"> {error}</p>}

        <Button
          type="submit"
          className="w-full"
          disabled={formState.isSubmitting}
        >
          {formState.isSubmitting
            ? "Entrando..."
            : "Entrar"}
        </Button>
      </form>
    </div>
  );
}
