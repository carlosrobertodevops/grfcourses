// import NextAuth from "next-auth";
// import Credentials from "next-auth/providers/credentials";
// import { signIn as signInAPI } from "@/services/auth";

// export const { handlers, signIn, signOut, auth } = NextAuth({
//   providers: [
//     Credentials({
//       name: "credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) return null;

//         const response = await signInAPI({
//           email: credentials.email,
//           password: credentials.password,
//         });

//         if (!response.success || !response.data) return null;

//         return {
//           id: response.data.user.id,
//           name: response.data.user.name,
//           email: response.data.user.email,
//           access_token: response.data.access_token,
//         };
//       },
//     }),
//   ],
//   session: {
//     strategy: "jwt",
//   },
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id;
//         token.access_token = user.access_token;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (session.user) {
//         session.user.id = token.id as number;
//         session.user.access_token = token.access_token as string;
//       }
//       return session;
//     },
//   },
// });

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { signIn as signInAPI } from "@/services/auth";

type WrappedResponse = {
  success: boolean;
  data?: {
    user: { id: number; name: string; email: string };
    access_token: string;
  };
};

type PlainResponse = {
  user: { id: number; name: string; email: string };
  access_token: string;
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: process.env.NEXTAUTH_TRUST_HOST === "true",

  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        const email = credentials?.email?.toString().trim();
        const password = credentials?.password?.toString();

        if (!email || !password) return null;

        const response = (await signInAPI({
          email,
          password,
        })) as WrappedResponse | PlainResponse | null;

        if (!response) return null;

        // ✅ Caso 1: formato "wrapped" { success: true, data: {...} }
        if ((response as WrappedResponse).success === true) {
          const r = response as WrappedResponse;
          if (!r.data?.user?.id || !r.data?.access_token) return null;

          return {
            id: r.data.user.id,
            name: r.data.user.name,
            email: r.data.user.email,
            access_token: r.data.access_token,
          };
        }

        // ✅ Caso 2: formato "plain" do seu backend { user, access_token }
        if (
          (response as PlainResponse).access_token &&
          (response as PlainResponse).user?.id
        ) {
          const r = response as PlainResponse;

          return {
            id: r.user.id,
            name: r.user.name,
            email: r.user.email,
            access_token: r.access_token,
          };
        }

        return null;
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.access_token = (user as any).access_token;
        token.name = (user as any).name;
        token.email = (user as any).email;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as number;
        (session.user as any).access_token = token.access_token as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
});
