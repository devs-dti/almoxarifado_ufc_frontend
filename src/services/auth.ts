import { api, setAuthToken } from "../lib/api";
const USE_MOCKS =
  process.env.NEXT_PUBLIC_USE_MOCKS === "true";
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
  const path = USE_MOCKS
    ? "/api/mock/login"
    : "/auth/login";
  let res;
  try {
    res = await api.post<AuthResponse>(path, data);
    // Debug: log the final request URL and status
    // eslint-disable-next-line no-console
    console.log(
      "auth.login -> POST",
      api.defaults.baseURL
        ? api.defaults.baseURL + path
        : path,
      res.status
    );
  } catch (err: unknown) {
    // eslint-disable-next-line no-console
    console.error(
      "auth.login -> POST error",
      api.defaults.baseURL
        ? api.defaults.baseURL + path
        : path,
      err
    );
    throw err;
  }
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
  const path = USE_MOCKS ? "/api/mock/me" : "/auth/me";
  const res = await api.get<AuthResponse>(path);
  return res.data;
}
