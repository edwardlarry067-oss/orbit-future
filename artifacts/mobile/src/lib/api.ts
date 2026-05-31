import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";

const API_URL =
  Constants.expoConfig?.extra?.apiUrl ??
  "https://919f5ad5-63e6-417f-a233-cd5db7afc8b1-00-85820hjo0ee9.spock.replit.dev";

const TOKEN_KEY = "orbitfuture_token";

export async function getToken(): Promise<string | null> {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function setToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function removeToken(): Promise<void> {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

export async function apiRequest<T>(
  method: string,
  path: string,
  body?: unknown
): Promise<T> {
  const token = await getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(`${API_URL}/api/${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(err.error ?? `HTTP ${response.status}`);
  }

  return response.json() as Promise<T>;
}
