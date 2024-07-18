import {NextRequest, NextResponse} from "next/server";
import {cookies} from "next/headers";

//Routes middleware should not run on
export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

export function middleware(req: NextRequest) {
    if (req.nextUrl.pathname === "/" || req.nextUrl.pathname === "/admin") {
        const cookieStore = cookies()
        const token = cookieStore.get("token")
        if (!token || token.value.split(":").length < 3) {
            console.log("no token in the cookie.")
            return NextResponse.redirect(new URL("/login", req.url))
        }
    }
    return NextResponse.next();
}