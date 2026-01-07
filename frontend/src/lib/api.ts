import axios, { AxiosError } from "axios";
import { auth } from "@/lib/auth";

type Props = {
  endpoint: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  data?: object;
  withAuth?: boolean;
};

function getBaseURL() {
  // Server-side (dentro do container): usa API_URL (ex: http://backenddev:8000)
  // Browser-side: usa NEXT_PUBLIC_API_URL (ex: http://localhost:8000)
  const serverBase = process.env.API_URL;
  const browserBase = process.env.NEXT_PUBLIC_API_URL;

  const base = typeof window === "undefined" ? serverBase : browserBase;

  // Fallback seguro (evita undefined)
  // OBS: no browser "backenddev" NÃO funciona, por isso o NEXT_PUBLIC_API_URL é obrigatório.
  return (base || "http://localhost:8000") + "/api/v1";
}

export const api = async <TypeResponse>({
  endpoint,
  method = "GET",
  data,
  withAuth = true,
}: Props): Promise<API<TypeResponse>> => {
  const BASE_URL = getBaseURL();

  // IMPORTANTE:
  // `auth()` (NextAuth) usa `headers()` internamente e só pode ser executado
  // no *server-side* (request scope). Se este helper for usado no browser (client),
  // chamar `auth()` gera: "headers was called outside a request scope".
  //
  // Portanto: só tentamos obter session quando:
  // - estamos no server-side
  // - e withAuth === true
  const isServer = typeof window === "undefined";
  const session = isServer && withAuth ? await auth().catch(() => null) : null;

  const instance = axios.create({
    baseURL: BASE_URL,
  });

  if (withAuth && session?.user?.access_token) {
    instance.defaults.headers.common["Authorization"] =
      `Bearer ${session.user.access_token}`;
  }

  try {
    const request = await instance<API<TypeResponse>>(endpoint, {
      method,
      params: method === "GET" ? data : undefined,
      data: method !== "GET" ? data : undefined,
    });

    return request.data;
  } catch (error) {
    const e = error as AxiosError<APIError>;

    return {
      success: false,
      detail: e.response?.data?.detail || "An unexpected error occurred",
      code: e.response?.data?.code || "UNKNOWN_ERROR",
      data: null,
    };
  }
};
