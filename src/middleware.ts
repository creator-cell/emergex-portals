import { type NextRequest, NextResponse } from "next/server"
import { jwtDecode } from "jwt-decode"

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value

  const { pathname } = req.nextUrl

  if (!token && pathname !== "/sign-in") {
    return NextResponse.redirect(new URL("/sign-in", req.url))
  }

  if (token) {
    try {
      const decodedToken = jwtDecode(token) as { role: string }

      if (pathname.startsWith("/admin") && decodedToken.role !== "super-admin") {
        return NextResponse.redirect(new URL("/sign-in", req.url))
      }

      if (pathname === "/" && decodedToken.role !== "client-admin") {
        return NextResponse.redirect(new URL("/sign-in", req.url))
      }
    } catch (error) {
      console.error("Token decoding failed:", error)
      return NextResponse.redirect(new URL("/sign-in", req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/"],
}

