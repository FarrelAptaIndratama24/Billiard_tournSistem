import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function middleware(req: any) {
  const res = NextResponse.next();

  // ← Izinkan akses ke auth routes tanpa cek session
  const isLoginApi = req.nextUrl.pathname === "/api/login";
  const isRegisterApi = req.nextUrl.pathname === "/api/register";
  const isLoginPage = req.nextUrl.pathname === "/login";

  if (isLoginApi || isRegisterApi || isLoginPage) {
    return res; // langsung lanjut, skip auth check
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          res.cookies.set(name, value, options);
        },
        remove(name: string, options: any) {
          res.cookies.set(name, "", options);
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    if (req.nextUrl.pathname.startsWith("/api/")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return res;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/players/:path*",
    "/matches/:path*",
    "/api/:path*",
    "/login",
  ],
};
