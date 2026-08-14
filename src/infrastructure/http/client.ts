import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL ?? "/api/backend";

export const httpClient = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
