import { NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST() {
  const cookie = serialize("access_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });

  const response = NextResponse.json({ success: true, message: "Logged out" });
  response.headers.set("Set-Cookie", cookie);

  return response;
}
