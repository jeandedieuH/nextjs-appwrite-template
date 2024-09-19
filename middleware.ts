import { NextResponse } from "next/server";
import { getUser } from "./lib/actions/user.actions";

export async function middleware(request: {
  cookies: { delete: (arg0: string) => void };
  url: string | URL | undefined;
}) {
  const user = await getUser();
  if (!user) {
    request.cookies.delete("session");
    const response = NextResponse.redirect(new URL("/login", request.url));

    return response;
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/instructor/:path*", "/student/:path*"],
};
