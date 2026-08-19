import axios from "axios";
import { toast } from "sonner";
import type { ApiError } from "@/shared/types/api";

const baseURL = process.env.NEXT_PUBLIC_API_URL ?? "/api/backend";

export const httpClient = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Tenta extrair a mensagem do erro da API
    const apiError = error.response?.data as ApiError;
    const message = apiError?.message || error.message || "Erro desconhecido ao processar requisição.";
    // Dispara o toast de erro (padrão Sonner), exceto para verificações silenciosas de autenticação
    const isAuthCheck = error.config?.url?.includes("/auth/me") || error.config?.url?.includes("/auth/refresh-token");
    if (!isAuthCheck) {
      toast.error("Erro na Requisição", {
        description: message,
      });
    }

    // Se for erro de autenticação (401 ou 403), ejeta o usuário para a tela de login
    if (error.response?.status === 401 || error.response?.status === 403) {
      if (typeof window !== "undefined") {
        // Limpa o cookie fake antigo para o middleware não deixar ele voltar
        document.cookie = "auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        
        // Só redireciona se não estiver na tela de login, para evitar loop
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);
