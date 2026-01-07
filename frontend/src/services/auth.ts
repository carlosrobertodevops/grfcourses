import { api, API } from "@/lib/api";

export type AuthData = {
  id: number;
  name: string;
  email: string;
  access_token: string;
};

export async function signIn(payload: {
  email: string;
  password: string;
}): Promise<API<AuthData>> {
  return api<AuthData>({
    endpoint: "/accounts/signin/",
    method: "POST",
    data: payload,
    withAuth: false,
  });
}

export async function signUp(payload: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}): Promise<API<AuthData>> {
  return api<AuthData>({
    endpoint: "/accounts/signup/",
    method: "POST",
    data: {
      name: payload.name,
      email: payload.email,
      password: payload.password,
      password_confirmation: payload.confirmPassword, // igual Postman
    },
    withAuth: false,
  });
}
