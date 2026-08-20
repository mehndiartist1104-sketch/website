import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  trustHost: true,
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 8,
  },
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const isLoggedIn = !!auth?.user;

      if (!pathname.startsWith("/admin")) return true;
      if (pathname === "/admin/login" || pathname === "/admin/setup") return true;

      return isLoggedIn;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
