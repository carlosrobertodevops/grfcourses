// "use server";

// import axios, { AxiosError } from "axios";
// import { auth } from "@/lib/auth";

// type Props = {
//     endpoint: string;
//     method?: "GET" | "POST" | "PUT" | "DELETE";
//     data?: object;
//     withAuth?: boolean
// }

// const BASE_URL = process.env.API_URL + "/api/v1";

// export const api = async <TypeResponse>({ endpoint, method = "GET", data, withAuth = true }: Props): Promise<API<TypeResponse>> => {
//     const session = await auth()

//     const instance = axios.create({
//         baseURL: BASE_URL
//     })

//     if (withAuth && session?.user.access_token) {
//         instance.defaults.headers.common['Authorization'] = `Bearer ${session.user.access_token}`
//     }

//     try {
//         const request = await instance<API<TypeResponse>>(endpoint, {
//             method,
//             params: method == "GET" && data,
//             data: method != "GET" && data
//         })

//         return request.data
//     } catch (error) {
//         const e = error as AxiosError<APIError>

//         return {
//             success: false,
//             detail: e.response?.data.detail || "An unexpected error occurred",
//             code: e.response?.data.code || "UNKNOWN_ERROR",
//             data: null
//         }
//     }
// }

import axios, { AxiosError } from "axios";

type Props = {
  endpoint: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  data?: Record<string, any>;
  /**
   * When true, will attempt to attach `Authorization: Bearer <access_token>`
   * from NextAuth session (server or client).
   *
   * Default: false (most public endpoints should not require auth).
   */
  withAuth?: boolean;
};

const BASE_URL = (process.env.API_URL || "").replace(/\/$/, "") + "/api/v1";

async function getAccessToken(): Promise<string | undefined> {
  try {
    // Server-side (Node.js)
    if (typeof window === "undefined") {
      // dynamic import to avoid bundling server-only module into client
      const mod = await import("@/lib/auth");
      const session = await mod.auth();
      // @ts-ignore
      return session?.user?.access_token as string | undefined;
    }

    // Client-side (browser)
    const mod = await import("next-auth/react");
    const session = await mod.getSession();
    // @ts-ignore
    return session?.user?.access_token as string | undefined;
  } catch {
    return undefined;
  }
}

export const api = async <TypeResponse>({
  endpoint,
  method = "GET",
  data,
  withAuth = false,
}: Props): Promise<API<TypeResponse>> => {
  const instance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
  });

  if (withAuth) {
    const token = await getAccessToken();
    if (token) {
      instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }

  try {
    const request = await instance.request<API<TypeResponse>>({
      url: endpoint,
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
