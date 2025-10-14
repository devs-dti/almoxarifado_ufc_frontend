import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_FALLBACK_API_URL ||
  "";
// Create an Axios instance with default configuration

export const api = axios.create({
  // if API_URL is empty string, leave baseURL undefined so axios uses relative URLs
  baseURL: API_URL || undefined,
  headers: {
    "Content-Type": "application/json",
  },
});
// Utility function to check if running in the browser
function isBrowser() {
  return typeof window !== "undefined";
}

export function setAuthToken(token?: string | null) {
  if (token) {
    api.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${token}`;
    // Store token in localStorage or cookies as needed
    if (isBrowser())
      localStorage.setItem("authToken", token);
    // You can also set up interceptors here if needed
  } else {
    delete api.defaults.headers.common["Authorization"];
    // Remove token from storage as needed
    if (isBrowser()) localStorage.removeItem("authToken");
    // Remove interceptors if set up
  }
}

export function initAuthFromStorage() {
  // Only run on client side
  if (!isBrowser()) return;
  // Get token from localStorage or cookies
  const token = localStorage.getItem("authToken");
  if (token) setAuthToken(token);
  // Optionally, you can verify the token with a backend call here
}
