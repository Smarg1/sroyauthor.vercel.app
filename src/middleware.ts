import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/admin") && pathname !== "/admin") {
    const accessToken = req.cookies.get("access_token")?.value;
    const refreshToken = req.cookies.get("refresh_token")?.value;
    if (!accessToken) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (user && !error) {
      return NextResponse.next();
    }
    if (refreshToken) {
      const { data: refreshData } = await supabase.auth.refreshSession({
        refresh_token: refreshToken,
      });
      if (refreshData.session) {
        const res = NextResponse.next();
        res.cookies.set("access_token", refreshData.session.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          path: "/",
          sameSite: "strict",
          maxAge: 60 * 60,
        });
        if (refreshData.session.refresh_token) {
          res.cookies.set("refresh_token", refreshData.session.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 30,
          });
        }
        return res;
      }
    }
    return NextResponse.redirect(new URL("/admin", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
