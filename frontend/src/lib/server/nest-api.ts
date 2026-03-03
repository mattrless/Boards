import { cookies } from "next/headers";

export const AUTH_TOKEN_COOKIE_NAME = "token";

export function getApiBaseUrl() {
  const apiUrl = process.env.API_URL?.trim();
  if (!apiUrl) {
    throw new Error("API_URL is not configured");
  }
  return apiUrl;
}

export async function getBearerAuthHeader() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_TOKEN_COOKIE_NAME)?.value;

  if (!token) return {};

  return { Authorization: `Bearer ${token}` };
}
