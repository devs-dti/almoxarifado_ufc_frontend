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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

const isDev = process.env.NODE_ENV !== "production";

const emailSchema = isDev
  ? z.string().min(1, "email required (dev)")
  : z.string().email("invalid email address");

const schema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(6, "password must be at least 6 characters long"),
});
type formData = z.infer<typeof schema>;
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [error, setError] = useState<string | null>(null);
  const [lastSubmitted, setLastSubmitted] =
    useState<formData | null>(null);
  const { register, handleSubmit, formState } =
    useForm<formData>({
      resolver: zodResolver(schema),
    });

  async function onSubmit(data: formData) {
    console.log("onSubmit start", data);
    setError(null);
    // Save last submitted (dev) and show alert immediately so the user can see the credentials that will be sent
    setLastSubmitted(data);
    if (typeof window !== "undefined") {
      // eslint-disable-next-line no-alert
      window.alert(
        `Enviando login:\nemail: ${data.email}\npassword: ${data.password}`
      );
    }
    try {
      console.log(
        `Submitting login with data: ${JSON.stringify(
          data,
          null,
          2
        )}`
      );
      await login({
        email: data.email,
        password: data.password,
      });

      const user = useAuthStore.getState().user;
      alert(
        `✅ Login bem-sucedido!\n\nUsuário retornado:\n${JSON.stringify(
          user,
          null,
          2
        )}`
      );
      router.push("/dashboard");
    } catch (err: unknown) {
      // Debug: submit failed
      // eslint-disable-next-line no-console
      console.log("onSubmit error", err);
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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 gap-4 max-w-md mx-auto">
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
          onClick={() => {
            // eslint-disable-next-line no-console
            console.log(
              "LoginButton clicked - isSubmitting:",
              formState.isSubmitting
            );
          }}
        >
          {formState.isSubmitting
            ? "Entrando..."
            : "Entrar"}
        </Button>
        {process.env.NODE_ENV !== "production" && (
          <button
            type="button"
            className="mt-2 text-sm underline text-blue-600"
            onClick={() => {
              // eslint-disable-next-line no-console
              console.log(
                "Debug native button clicked - submitting form"
              );
              void handleSubmit(onSubmit)();
            }}
          >
            Debug: submit (native)
          </button>
        )}
      </form>
      {lastSubmitted && (
        <div className="mt-4 w-full max-w-sm bg-yellow-50 border border-yellow-200 p-3 rounded text-sm text-yellow-800">
          <strong>Debug — último submit:</strong>
          <pre className="whitespace-pre-wrap">
            {JSON.stringify(lastSubmitted, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
