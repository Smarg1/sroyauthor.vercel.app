import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const encoder = new TextEncoder();
const JWT_SECRET = encoder.encode(process.env.JWT_SECRET || "");

// ===== JWT UTILS =====
function base64UrlDecode(str: string) {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  return Uint8Array.from(atob(str), (c) => c.charCodeAt(0));
}

async function verifyJWT(token: string) {
  try {
    const [headerB64, payloadB64, sigB64] = token.split(".");
    if (!headerB64 || !payloadB64 || !sigB64) throw new Error("Malformed token");

    const data = `${headerB64}.${payloadB64}`;
    const signature = base64UrlDecode(sigB64);

    const key = await crypto.subtle.importKey(
      "raw",
      JWT_SECRET,
      { name: "HMAC", hash: "SHA-512" },
      false,
      ["verify"]
    );

    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      signature,
      new TextEncoder().encode(data)
    );
    if (!isValid) throw new Error("Invalid signature");

    const payloadJson = atob(payloadB64);
    const payload = JSON.parse(payloadJson);

    if (payload.exp && Date.now() >= payload.exp * 1000) throw new Error("Token expired");

    return payload;
  } catch {
    return null;
  }
}

// ===== MIDDLEWARE =====
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin") && pathname !== "/admin") {
    const accessToken = req.cookies.get("access_token")?.value;
    const refreshToken = req.cookies.get("refresh_token")?.value;

    if (accessToken) {
      const payload = await verifyJWT(accessToken);
      if (payload) {
        const res = NextResponse.next();
        setSecurityHeaders(res);
        return res;
      }
    }

    if (refreshToken) {
      try {
        const refreshResponse = await fetch(`${req.nextUrl.origin}/api/refresh`, {
          method: "POST",
          headers: { cookie: `refresh_token=${refreshToken}` }
        });

        if (refreshResponse.ok) {
          const { access_token } = await refreshResponse.json();
          const res = NextResponse.next();
          res.cookies.set("access_token", access_token, {
            httpOnly: true,
            secure: true,
            path: "/",
            sameSite: "strict",
            maxAge: 90
          });
          setSecurityHeaders(res);
          return res;
        }
      } catch {}
    }

    return NextResponse.redirect(new URL("/admin", req.url));
  }

  const res = NextResponse.next();
  setSecurityHeaders(res);
  return res;
}

// ===== STATIC SECURITY HEADERS =====
function setSecurityHeaders(res: NextResponse) {
  const csp = [
    "default-src 'self'",
    "script-src 'self' https://va.vercel-scripts.com 'unsafe-eval' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' https://r9qjyxeyq4yjgv2k.public.blob.vercel-storage.com",
    "font-src 'self'",
    "connect-src 'self' https://va.vercel-scripts.com https://*.supabase.co https://*.supabase.net https://*.vercel-storage.com https://vercel.app",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ].join("; ");

  res.headers.set("Content-Security-Policy", csp);
  res.headers.set("X-XSS-Protection", "1; mode=block");
  res.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  res.headers.set("Cross-Origin-Embedder-Policy", "require-corp");
}

// Protect all routes
export const config = {
  matcher: ["/(.*)"]
};
