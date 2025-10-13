import { api, setAuthToken } from "../lib/api";

export type LoginPayLoad = {
  email: string;
  password: string;
};

export type AuthResponse = {
  token: string;
  user?: Record<string, unknown> | null;
};

export async function login(
  data: LoginPayLoad
): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>(
    "/auth/login",
    data
  );
  if (!res.data.token) {
    throw new Error("No token returned");
  }
  setAuthToken(res.data.token);
  return {
    token: res.data.token,
    user: res.data.user ?? null,
  };
}

export async function logout() {
  setAuthToken(null);
}

export async function me(): Promise<AuthResponse> {
  const res = await api.get<AuthResponse>("/auth/me");
  return res.data;
}
