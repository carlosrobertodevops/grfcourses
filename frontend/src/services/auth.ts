// import { api } from "@/lib/api";
// import { SignInForm, SignUpForm } from "@/schemas/auth";

// /**
//  * Backend endpoints:
//  * - POST /api/v1/accounts/signin/
//  * - POST /api/v1/accounts/signup/
//  *
//  * Note: these are public endpoints, so `withAuth: false`.
//  */
// export const signIn = async (data: SignInForm) => {
//   return api<APISignInResponse>({
//     endpoint: "/accounts/signin/",
//     method: "POST",
//     data,
//     withAuth: false,
//   });
// };

// export const signUp = async (data: SignUpForm) => {
//   // Backend does not require confirmPassword, but we keep it in the frontend schema.
//   // Send only the fields backend uses.
//   return api<APISignUpResponse>({
//     endpoint: "/accounts/signup/",
//     method: "POST",
//     data: {
//       name: data.name,
//       email: data.email,
//       password: data.password,
//       // If your backend ever enforces confirmation, uncomment below:
//       // password_confirmation: data.confirmPassword,
//     },
//     withAuth: false,
//   });
// };

import { api } from "@/lib/api";
import { SignInForm, SignUpForm } from "@/schemas/auth";

/**
 * Backend endpoints (Django):
 * - POST /api/v1/accounts/signin/
 * - POST /api/v1/accounts/signup/
 */

export const signIn = async (data: SignInForm) => {
  return api<APISignInResponse>({
    endpoint: "/accounts/signin/",
    method: "POST",
    data,
    withAuth: false,
  });
};

export const signUp = async (data: SignUpForm) => {
  return api<APISignUpResponse>({
    endpoint: "/accounts/signup/",
    method: "POST",
    data: {
      name: data.name,
      email: data.email,
      password: data.password,
      // Backend expects this field (validated in Postman)
      password_confirmation: data.confirmPassword,
    },
    withAuth: false,
  });
};
