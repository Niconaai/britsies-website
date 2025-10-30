// middleware.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  console.log(`Middleware running for path: ${request.nextUrl.pathname}`);

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        // --- CORRECTED IMPLEMENTATION ---
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // If the cookie is set, update the request cookies as well.
          request.cookies.set({
            name,
            value,
            ...options,
          });
          // Update the response to set the cookie
          supabaseResponse = NextResponse.next({
            request,
          });
          supabaseResponse.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          // If the cookie is removed, update the request cookies as well.
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          // Update the response to remove the cookie
          supabaseResponse = NextResponse.next({
            request,
          });
          supabaseResponse.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
        // --- END CORRECTION ---
      },
    }
  );

  // IMPORTANT: getUser() must be called to refresh session
  const { data: { user } } = await supabase.auth.getUser();
  console.log('Middleware user check:', user ? `User Found (${user.email})` : 'No User Found');

  // This logic is fine, it just ensures the session is refreshed.
  // The actual route protection happens in the layouts/pages themselves.
  if (!user && request.nextUrl.pathname === '/admin/login') {
      console.log('Middleware: No user, on login page. Allowing.');
      return supabaseResponse;
  }

  console.log('Middleware: Refreshing session / allowing request through.');
  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for static assets, images, etc.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}