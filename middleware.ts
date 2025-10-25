// middleware.ts (at root or in src/)
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  console.log(`Middleware running for path: ${request.nextUrl.pathname}`); // Add log

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, // Check .env.local matches
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: getUser() must be called to refresh session
  // Let's get the user data first
  const { data: { user } } = await supabase.auth.getUser();
  console.log('Middleware user check:', user ? `User Found (${user.email})` : 'No User Found'); // Add log

  // If the user is NOT logged in AND they are trying to access the login page,
  // skip further checks and just return the basic response.
  // This might prevent a loop if getUser() interferes with the login page rendering.
  if (!user && request.nextUrl.pathname === '/admin/login') {
      console.log('Middleware: No user, accessing login page. Skipping further checks.'); // Add log
      return supabaseResponse; // Return response potentially without updated cookies yet, layout will handle redirect
  }

  // If we are anywhere else (or if the user IS logged in), ensure the session refresh completes fully.
  // The layout will handle redirects for protected routes.
  console.log('Middleware: Refreshing session / allowing request through.'); // Add log

  // Return the response object (might have been updated by setAll cookie handler)
  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for static assets, images, etc.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}