import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const urlPath = request.nextUrl.pathname;
  const token = request.cookies.get("auth_token")?.value;
  const expiresAt = request.cookies.get("expires_at")?.value;

  // Redirect to login if token is not present
  if (urlPath.startsWith("/profile") && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token && expiresAt) {
    const expirationDate = new Date(expiresAt);
    const currentTime = new Date();

    if (currentTime > expirationDate) {
      // Token expired, clear cookies and redirect to login
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("auth_token");
      response.cookies.delete("expires_at");
      response.cookies.delete("userId");
      request.cookies.clear();
      return response;
    }
  }
  // Redirect authenticated users away from login/register pages
  if (token && (urlPath === "/login" || urlPath === "/register")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Headers to retrive in server page components
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/movie/:path*", "/tv/:path*", "/profile", "/login", "/register"],
};
