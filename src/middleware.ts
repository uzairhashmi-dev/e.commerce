import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/auth.config";
import { verifyAdminToken, ADMIN_COOKIE_NAME } from "@/lib/adminAuth";

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  const { pathname } = req.nextUrl;
  const isAdminRoute = pathname.startsWith("/admin");

  const adminToken = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const adminSession = adminToken ? await verifyAdminToken(adminToken) : null;

  // === Admin routes ===
  if (isAdminRoute) {
    if (pathname === "/admin/login") {
      if (adminSession) {
        return NextResponse.redirect(new URL("/admin/dashboard", req.nextUrl));
      }
      return NextResponse.next();
    }

    if (!adminSession) {
      return NextResponse.redirect(new URL("/admin/login", req.nextUrl));
    }

    return NextResponse.next();
  }

  // === Non-admin routes: agar admin session active hai, poora public site block ===
  if (adminSession) {
    return NextResponse.redirect(new URL("/admin/dashboard", req.nextUrl));
  }

  // === Customer auth logic (jaisa pehle tha) ===
  const isLoggedIn = !!req.auth?.user;
  const isOnLogin = pathname === "/login";

  if (isOnLogin) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/", req.nextUrl));
    }
    return NextResponse.next();
  }

  const isProfilePath = pathname === "/profile" || pathname.startsWith("/profile/");
  const isOrdersListPath = pathname === "/orders";

  if ((isProfilePath || isOrdersListPath) && !isLoggedIn) {
    return NextResponse.redirect(
      new URL(`/login?callbackUrl=${encodeURIComponent(pathname)}`, req.nextUrl)
    );
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};