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
  user: AuthResponse["user"] | null;
  loading: boolean;
  setAuth: (user: AuthResponse["user"] | null) => void;
  login: (data: LoginPayLoad) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: () => boolean;
  fetchMe: () => Promise<void>;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      loading: false,
      setAuth: (user: AuthResponse["user"] | null = null) => {
        set(() => ({ user }));
      },
      login: async (data: LoginPayLoad) => {
        set({ loading: true });
        try {
          const response = await loginService(data);
          
          //Saving user in localStorage and setting auth for future requests 
          set({
            user: response.user,
            loading: false,
          });
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },
      logout: async () => {
        await logoutService();
        set(() => ({
          user: null,
          loading: false,
        }));
      },
      isAuthenticated: (): boolean => {
        // Check if user is not null to determine if authenticated
        return Boolean(get().user);
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
        user: state.user, // Saving only the user object, not loading or functions
      }),
    }
  )
);
