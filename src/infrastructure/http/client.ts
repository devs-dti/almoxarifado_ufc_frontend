import axios from "axios";

// const useMocks = process.env.NEXT_PUBLIC_USE_MOCKS === 'true'

export const httpClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
