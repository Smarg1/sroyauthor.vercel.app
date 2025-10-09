import { NextRequest, NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { access_token, refresh_token } = body;

  if (!access_token || !refresh_token) {
    return NextResponse.json({ message: "Tokens missing" }, { status: 400 });
  }

  const response = NextResponse.json({ message: "Cookies set" });

  response.headers.append(
    "Set-Cookie",
    serialize("access_token", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "strict",
      maxAge: 60 * 60,
    })
  );

  response.headers.append(
    "Set-Cookie",
    serialize("refresh_token", refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30,
    })
  );

  return response;
}
