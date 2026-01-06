import axios, { AxiosError } from "axios";

type Props = {
  endpoint: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  data?: any;
  withAuth?: boolean;
};

type APIError = {
  detail?: string;
  code?: string;
};

export type APIResponse<T> = {
  success: boolean;
  detail: string;
  code?: string;
  data: T | null;
};

// =====================
// Base URL
// =====================
function getBaseUrl(): string {
  // No server: API_URL
  // No browser: NEXT_PUBLIC_API_URL
  const serverBase = process.env.API_URL?.trim();
  const publicBase = process.env.NEXT_PUBLIC_API_URL?.trim();

  const base = serverBase || publicBase || "";
  if (!base) return "";

  return `${base}/api/v1`;
}

// =====================
// Token
// =====================
async function getAccessToken(): Promise<string | null> {
  // Browser
  if (typeof window !== "undefined") {
    const fromLS = window.localStorage.getItem("access_token");
    if (fromLS) return fromLS;

    // fallback cookie no browser
    const m = document.cookie.match(/(?:^|;\s*)access_token=([^;]+)/);
    return m ? decodeURIComponent(m[1]) : null;
  }

  // Server
  try {
    const { cookies } = await import("next/headers");
    const token = cookies().get("access_token")?.value;
    return token || null;
  } catch {
    return null;
  }
}

// =====================
// Core requester
// =====================
export const api = async <TypeResponse>({
  endpoint,
  method = "GET",
  data,
  withAuth = true,
}: Props): Promise<APIResponse<TypeResponse>> => {
  const BASE_URL = getBaseUrl();

  if (!BASE_URL) {
    return {
      success: false,
      detail:
        "API base URL is not configured. Set API_URL (server) or NEXT_PUBLIC_API_URL (client).",
      code: "MISSING_API_URL",
      data: null,
    };
  }

  const instance = axios.create({ baseURL: BASE_URL });

  if (withAuth) {
    const accessToken = await getAccessToken();
    if (accessToken) {
      instance.defaults.headers.common["Authorization"] =
        `Bearer ${accessToken}`;
    }
  }

  try {
    const request = await instance.request({
      url: endpoint,
      method,
      params: method === "GET" ? data : undefined,
      data: method !== "GET" ? data : undefined,
    });

    return request.data as APIResponse<TypeResponse>;
  } catch (error) {
    const e = error as AxiosError<any>;
    return {
      success: false,
      detail: e.response?.data?.detail || "An unexpected error occurred",
      code: e.response?.data?.code || "UNKNOWN_ERROR",
      data: null,
    };
  }
};

// =====================
// Helpers (se seu projeto usa)
/// Exemplo: apiGet("/accounts/me")
/// =====================
export async function apiGet<T>(endpoint: string, withAuth = true) {
  return api<T>({ endpoint, method: "GET", withAuth });
}

export async function apiPost<T>(
  endpoint: string,
  data?: any,
  withAuth = true,
) {
  return api<T>({ endpoint, method: "POST", data, withAuth });
}

export async function apiPut<T>(endpoint: string, data?: any, withAuth = true) {
  return api<T>({ endpoint, method: "PUT", data, withAuth });
}

export async function apiDelete<T>(endpoint: string, withAuth = true) {
  return api<T>({ endpoint, method: "DELETE", withAuth });
}
