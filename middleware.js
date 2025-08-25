import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/auth-helpers-nextjs"

export async function middleware(req) {
  const res = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,  // ✅ usa anon key
    {
      cookies: {
        get(name) {
          return req.cookies.get(name)?.value
        },
        set(name, value, options) {
          res.cookies.set(name, value, options)
        },
        remove(name, options) {
          res.cookies.delete(name, options)
        },
      },
    }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // 👇 se non loggato → vai a /login
  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  return res
}

// ✅ middleware solo per /gestionale/*
export const config = {
  matcher: ["/gestionale/:path*"],
}
