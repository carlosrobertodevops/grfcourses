import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { signIn as signInAPI } from "@/services/auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: process.env.NEXTAUTH_TRUST_HOST === "true",
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email || "").trim();
        const password = String(credentials?.password || "");

        if (!email || !password) return null;

        // Backend retorna: { success: true, data: { id, name, email, access_token } }
        const response = await signInAPI({ email, password });

        if (!response?.success || !response.data) return null;

        return {
          id: response.data.id,
          name: response.data.name,
          email: response.data.email,
          access_token: response.data.access_token,
        };
      },
    }),
  ],

  session: { strategy: "jwt" },

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
      // Mantém compatível com seu código atual (session.user.access_token)
      (session as any).user = session.user || {};
      (session as any).user.id = (token as any).id ?? null;
      (session as any).user.access_token = (token as any).access_token ?? null;
      return session;
    },
  },
});
