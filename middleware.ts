// middleware.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { AuthApiError } from '@supabase/supabase-js'

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
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
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
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          supabaseResponse = NextResponse.next({
            request,
          });
          supabaseResponse.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  let userEmail = 'No User Found';

  // try {
  //   const { data: { user } } = await supabase.auth.getUser();
  //   if (user) {
  //     userEmail = `User Found (${user.email})`;

      // Spesifieke admin-roete-beskerming
      if (!user.email?.endsWith('@hsbrits.co.za') && request.nextUrl.pathname.startsWith('/admin')) {
          console.log('Middleware: Nie-admin gebruiker probeer /admin toegang kry. Herlei na /login.');
          return NextResponse.redirect(new URL('/login?error=Nie gemagtig nie', request.url));
      // }
    // } else {
    //     if (request.nextUrl.pathname.startsWith('/admin') && request.nextUrl.pathname !== '/admin/login') {
    //          console.log('Middleware: Geen gebruiker, probeer admin-area kry. Herlei na /admin/login.');
    //          return NextResponse.redirect(new URL('/admin/login', request.url));
    //     }
    //     if (request.nextUrl.pathname.startsWith('/portaal') && request.nextUrl.pathname !== '/portaal/begin') {
    //          console.log('Middleware: Geen gebruiker, probeer portaal kry. Herlei na /portaal/begin.');
    //          return NextResponse.redirect(new URL('/portaal/begin', request.url));
    //     }
    // }
  } catch (error) {
    if (
      error instanceof AuthApiError &&
      error.code === 'refresh_token_not_found'
    ) {
      userEmail = 'No User Found (Guest)';
    } else {
      console.error('Middleware Auth Error:', error);
    }
  }

  console.log(`Middleware user check: ${userEmail}`);
  
  console.log('Middleware: Refreshing session / allowing request through.');
  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}