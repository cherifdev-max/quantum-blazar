import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const session = request.cookies.get("session");
    const isLoginPage = request.nextUrl.pathname === "/login";

    // If user is not logged in and tries to access protected route (anything other than /login)
    if (!session && !isLoginPage) {
        // Exclude static files and api routes if needed
        if (request.nextUrl.pathname.startsWith('/_next') || request.nextUrl.pathname.match(/\.(png|jpg|jpeg|gif|ico|svg)$/)) {
            return NextResponse.next();
        }
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // If user is logged in and tries to access /login, redirect to dashboard
    if (session && isLoginPage) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
