import { createAuthClient } from "better-auth/react";

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_BETTER_AUTH_URL) return process.env.NEXT_PUBLIC_BETTER_AUTH_URL;
  if (process.env.BETTER_AUTH_URL) return process.env.BETTER_AUTH_URL;
  if (typeof window !== "undefined") return window.location.origin;
  return "http://localhost:3000";
};

export const authClient = createAuthClient({
  baseURL: getBaseUrl(),
});

export const { signIn, signUp, useSession } = authClient;