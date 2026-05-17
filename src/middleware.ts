import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { NextResponse } from "next/server"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const role = req.auth?.user?.role

  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth")
  const isPublicRoute =
    nextUrl.pathname === "/" ||
    nextUrl.pathname === "/login" ||
    nextUrl.pathname === "/unauthorized" ||
    nextUrl.pathname === "/test"

  // Always allow auth API & static pages
  if (isApiAuthRoute) return NextResponse.next()
  if (isPublicRoute) return NextResponse.next()

  // Redirect unauthenticated users to login
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/login", nextUrl))
  }

  // RBAC route protections
  if (nextUrl.pathname.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/unauthorized", nextUrl))
  }

  if (
    nextUrl.pathname.startsWith("/manager") &&
    role !== "MANAGER" &&
    role !== "ADMIN"
  ) {
    return NextResponse.redirect(new URL("/unauthorized", nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
