import { create } from "zustand";
import { persist } from "zustand/middleware";
import { setAuthToken } from "../lib/api";
import {
  login as loginService,
  logout as logoutService,
  me,
  type AuthResponse,
  type LoginPayLoad,
} from "../services/auth";

type AuthState = {
  token: string | null;
  user: AuthResponse["user"] | null;
  loading: boolean;
  setAuth: (
    token: string | null,
    user: AuthResponse["user"] | null
  ) => void;
  login: (data: LoginPayLoad) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: () => boolean;
  fetchMe: () => Promise<void>;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      loading: false,
      setAuth: (
        token: string | null,
        user: string | null = null
      ) => {
        setAuthToken(token);
        set(() => ({ token, user }));
      },
      login: async (data: LoginPayLoad) => {
        set({ loading: true });
        try {
          const response = await loginService(data);
          setAuthToken(response.token);
          set({
            token: response.token,
            user: response.user,
            loading: false,
          });
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },
      logout: async () => {
        setAuthToken(null);
        await logoutService();
        set(() => ({
          token: null,
          user: null,
          loading: false,
        }));
      },
      isAuthenticated: (): boolean => {
        return Boolean(get().token);
      },
      fetchMe: async () => {
        set({ loading: true });
        try {
          const user = await me();
          set({ user: user || null, loading: false });
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state: AuthState) => ({
        token: state.token,
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          setAuthToken(state.token);
        }
      },
    }
  )
);
