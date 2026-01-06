// import axios, { AxiosError } from "axios";

// type Props = {
//   endpoint: string;
//   method?: "GET" | "POST" | "PUT" | "DELETE";
//   data?: Record<string, any>;
//   /**
//    * When true, will attempt to attach `Authorization: Bearer <access_token>`
//    * from NextAuth session (server or client).
//    *
//    * Default: false (most public endpoints should not require auth).
//    */
//   withAuth?: boolean;
// };

// const BASE_URL = (process.env.API_URL || "").replace(/\/$/, "") + "/api/v1";

// async function getAccessToken(): Promise<string | undefined> {
//   try {
//     // Server-side (Node.js)
//     if (typeof window === "undefined") {
//       // dynamic import to avoid bundling server-only module into client
//       const mod = await import("@/lib/auth");
//       const session = await mod.auth();
//       // @ts-ignore
//       return session?.user?.access_token as string | undefined;
//     }

//     // Client-side (browser)
//     const mod = await import("next-auth/react");
//     const session = await mod.getSession();
//     // @ts-ignore
//     return session?.user?.access_token as string | undefined;
//   } catch {
//     return undefined;
//   }
// }

// export const api = async <TypeResponse>({
//   endpoint,
//   method = "GET",
//   data,
//   withAuth = false,
// }: Props): Promise<API<TypeResponse>> => {
//   const instance = axios.create({
//     baseURL: BASE_URL,
//     withCredentials: true,
//   });

//   if (withAuth) {
//     const token = await getAccessToken();
//     if (token) {
//       instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//     }
//   }

//   try {
//     const request = await instance.request<API<TypeResponse>>({
//       url: endpoint,
//       method,
//       params: method === "GET" ? data : undefined,
//       data: method !== "GET" ? data : undefined,
//     });

//     return request.data;
//   } catch (error) {
//     const e = error as AxiosError<APIError>;

//     return {
//       success: false,
//       detail: e.response?.data?.detail || "An unexpected error occurred",
//       code: e.response?.data?.code || "UNKNOWN_ERROR",
//       data: null,
//     };
//   }
// };

import axios, { AxiosError } from "axios";

type Props = {
  endpoint: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  data?: Record<string, any>;
<<<<<<< HEAD
  /**
   * When true, attaches `Authorization: Bearer <access_token>` from NextAuth session.
   * Default: false
   */
  withAuth?: boolean;
};

type APIError = {
  success?: boolean;
  detail?: string;
  code?: string;
  data?: any;
};

/**
 * IMPORTANT (Docker + Browser):
 *
 * - In the BROWSER, the request must go to http://localhost:8000 (Django exposed port),
 *   because the browser cannot reach Docker internal DNS (backenddev).
 *   => Use NEXT_PUBLIC_API_URL for client-side.
 *
 * - In SERVER-SIDE (NextAuth / route handlers / server actions), we CAN reach Docker DNS:
 *   => Use API_URL=http://backenddev:8000
 *
 * If NEXT_PUBLIC_API_URL is missing, axios falls back to a relative URL like "/api/v1/..."
 * which hits Next.js itself (localhost:3000) and returns 404.
 */

const buildBaseUrl = async (): Promise<string> => {
  const isServer = typeof window === "undefined";

  if (isServer) {
    // Server-side: prefer Docker service hostname
    const serverBase = (process.env.API_URL || "http://backenddev:8000").replace(/\/$/, "");
    return `${serverBase}/api/v1`;
  }

  // Client-side: must use NEXT_PUBLIC_
  const clientBase = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
  return `${clientBase}/api/v1`;
};
=======
  withAuth?: boolean;
};

const BASE_URL =
  (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "") + "/api/v1";
>>>>>>> 0d0f94a (Ajustes)

export const api = async <TypeResponse>({
  endpoint,
  method = "GET",
  data,
  withAuth = false,
}: Props): Promise<API<TypeResponse>> => {
  const baseURL = await buildBaseUrl();

  const instance = axios.create({
<<<<<<< HEAD
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  try {
    if (withAuth) {
      // Only load NextAuth on server-side
      if (typeof window === "undefined") {
        const mod = await import("@/lib/auth");
        const session = await mod.auth();

        const token = session?.user?.access_token;
        if (token) {
          instance.defaults.headers.common.Authorization = `Bearer ${token}`;
        }
      }
    }

    const request = await instance.request<API<TypeResponse>>({
      url: endpoint,
      method,
      data: method !== "GET" ? data : undefined,
=======
    baseURL: BASE_URL,
    withCredentials: false,
  });

  try {
    const response = await instance.request<API<TypeResponse>>({
      url: endpoint,
      method,
      data,
>>>>>>> 0d0f94a (Ajustes)
    });

    return response.data;
  } catch (error) {
    const e = error as AxiosError<any>;
    return {
      success: false,
      detail:
        e.response?.data?.detail ||
        e.response?.data?.message ||
        "Erro inesperado",
      code: "API_ERROR",
      data: null,
    };
  }
};
