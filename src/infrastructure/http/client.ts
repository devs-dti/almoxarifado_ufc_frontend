import axios from "axios";
import { toast } from "sonner";
import type { ApiError } from "@/shared/types/api";

// const useMocks = process.env.NEXT_PUBLIC_USE_MOCKS === 'true'

export const httpClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Tenta extrair a mensagem do erro da API
    const apiError = error.response?.data as ApiError;
    const message = apiError?.message || error.message || "Erro desconhecido ao processar requisição.";
    
    // Dispara o toast de erro (padrão Sonner)
    toast.error("Erro na Requisição", {
      description: message,
    });

    return Promise.reject(error);
  }
);
