import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = request.nextUrl;
      const isOnLogin = pathname === "/login";

      if (isOnLogin) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/", request.nextUrl));
        }
        return true;
      }

      const isAdminPath = pathname === "/admin" || pathname.startsWith("/admin/");
      if (isAdminPath) {
        if (!isLoggedIn) return false;
        if (auth?.user?.role !== "admin") {
          return Response.redirect(new URL("/", request.nextUrl));
        }
        return true;
      }

      const isProfilePath = pathname === "/profile" || pathname.startsWith("/profile/");
      const isOrdersListPath = pathname === "/orders";

      if ((isProfilePath || isOrdersListPath) && !isLoggedIn) {
        return false;
      }

      return true;
    },
  },
} satisfies NextAuthConfig;