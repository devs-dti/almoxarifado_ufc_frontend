import axios from "axios";

const useMocks = process.env.NEXT_PUBLIC_USE_MOCKS === 'true'

export const httpClient = axios.create({
  // In dev/prod: route through Next.js proxy (/api/backend) so cookies stay same-origin
  // This bypasses SameSite=Lax restriction on the backend's httpOnly cookies
  baseURL: useMocks ? '' : '/api/backend',
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
