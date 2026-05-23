"use client";

import React, { useState } from "react";
import { api } from "@/lib/api";
import { FaPlusCircle } from "react-icons/fa";
import { Button } from "@/components/ui/button";

interface RegisterBottonProps {
  transactionType: "entrada" | "saida" | null;
  payload?: Record<string, unknown>; // UPCOMING: Loose object contract designed to implicitly spread future Zod/React Hook Form outputs
  onSuccess?: () => void; // CALLBACK: Dispatched to trigger view validation resets or interface layout closeouts
}

export function RegisterBotton({
  transactionType,
  payload,
  onSuccess,
}: RegisterBottonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ACTION CONTROLLER: Orchestrates mutation requests and handles structural endpoint routing
  const handleCadastro = async () => {
    if (!transactionType) return;

    setIsLoading(true);
    setError(null);

    try {
      // POLYMORPHIC ROUTING: Resolves target Spring Boot endpoints dynamically based on active transaction scope
      const urlDestino =
        transactionType === "entrada" ? "/transfers/entry" : "/transfers/exit";
      const typeEnum = transactionType === "entrada" ? "ENTRY" : "EXIT";

      // NETWORK DISPATCH: Merges explicit system parameters seamlessly into incoming dynamic payload objects
      const response = await api.post(urlDestino, {
        type: typeEnum,
        ...payload,
      });

      console.log(
        `Sucesso ao cadastrar na rota [${urlDestino}]:`,
        response.data,
      );

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error(`Erro na API ao tentar cadastrar ${transactionType}:`, err);
      setError("Falha ao salvar o cadastro. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-2">
      {/* SHADCN INTEGRATION: Uses downstream button primitive while layering localized interactive animations */}
      <Button
        onClick={handleCadastro}
        disabled={isLoading || !transactionType}
        className="py-4 font-semibold text-base transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(138,56,245,0.25)]"
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            Cadastrar
            <FaPlusCircle className="text-xl" />
          </>
        )}
      </Button>

      {/* ERROR HANDLER GRAPHICS: Encapsulated strictly below trigger viewport space to isolate layout shifts */}
      {error && (
        <span className="text-sm font-medium text-red-500 animate-slide-down">
          {error}
        </span>
      )}
    </div>
  );
}
