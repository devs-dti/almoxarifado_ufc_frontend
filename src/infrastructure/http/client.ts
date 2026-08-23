import axios from "axios";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { sanitizeApiErrorMessage } from "@/shared/lib/sanitizeApiError";

const baseURL = process.env.NEXT_PUBLIC_API_URL ?? "/api/backend";

export const httpClient = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

httpClient.interceptors.request.use((config) => {
  const token = Cookies.get("auth-token");
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Sanitiza e mapeia para mensagem amigável sem expor UUIDs ou códigos internos
    const friendlyMessage = sanitizeApiErrorMessage(error);

    // Dispara o toast de erro (padrão Sonner) apenas se não for erro de autenticação/autorização ou logout
    const isAuthError = error.response?.status === 401 || error.response?.status === 403;
    const isLogout = error.config?.url?.includes('/auth/logout');
    const isAuthCheck = error.config?.url?.includes('/auth/me') || error.config?.url?.includes('/auth/refresh-token');

    if (!isAuthError && !isLogout && !isAuthCheck) {
      toast.error(friendlyMessage);
    }
    return Promise.reject(error);
  }
);
