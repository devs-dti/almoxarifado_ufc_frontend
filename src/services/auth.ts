import { api, setAuthToken } from "../lib/api";
const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === "true";

export type LoginPayLoad = {
  email: string;
  password: string;
};

export type AuthResponse = {
  token?: string;
  user?: Record<string, unknown> | null;
};

export async function login(data: LoginPayLoad): Promise<AuthResponse> {
  // const path = "/auth/login"; // Original path without mocks
  const path = USE_MOCKS ? "/api/mock/login" : "/auth/login"; // CHANGED: Use mock path if mocks are enabled
  let res;
  
  try {
    // CHANGED: Fixed Axios syntax to include withCredentials as the 3rd parameter
    res = await api.post<AuthResponse>(path, data, {
      withCredentials: true,
    });
    
    // eslint-disable-next-line no-console
    console.log("auth.login -> POST SUCCESS", res.status);
  } catch (err: unknown) {
    // eslint-disable-next-line no-console
    console.error("auth.login -> POST error", err);
    throw err;
  }

  // CHANGED: Removed the forced error if token is missing. 
  // We trust the HttpOnly cookie now.
  setAuthToken(res?.data?.token);
  
  return {
    token: res?.data?.token ?? "", 
    user: res?.data?.user ?? null,
  };
}

export async function logout() {
  setAuthToken(null);
}

export async function me(): Promise<AuthResponse> {
  const path = USE_MOCKS ? "/api/mock/me" : "/auth/me";
  
  // Cookies to be sent automatically by the browser
  const res = await api.get<AuthResponse>(path, {
    withCredentials: true,
  });
  return res.data;
}