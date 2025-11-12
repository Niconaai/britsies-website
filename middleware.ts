// middleware.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { AuthApiError } from '@supabase/supabase-js';

export async function middleware(request: NextRequest) {
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
          request.cookies.set({ name, value, ...options });
          supabaseResponse = NextResponse.next({ request });
          supabaseResponse.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options });
          supabaseResponse = NextResponse.next({ request });
          supabaseResponse.cookies.set({ name, value: '', ...options });
        },
      },
    },
  );

  const { pathname } = request.nextUrl;
  let userRole: string | null = null;
  let userId: string | null = null;

  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      // --- GEBRUIKER IS NIE INGETEKEN NIE (GAS) ---
      console.log(`Middleware: Guest accessing path: ${pathname}`);

      // 1. Beskerm Admin-area
      if (pathname.startsWith('/admin')) {
        console.log('Middleware: Guest accessing /admin. Redirecting to /login.');
        return NextResponse.redirect(new URL('/login', request.url));
      }

      // 2. Beskerm Ouer Portaal (laat /portaal/begin toe)
      if (pathname.startsWith('/portaal') && pathname !== '/portaal/begin') {
        console.log('Middleware: Guest accessing protected /portaal. Redirecting to /portaal/begin.');
        const redirectUrl = new URL('/portaal/begin', request.url);
        redirectUrl.searchParams.set('redirect_to', pathname); // Onthou waarheen hulle wou gaan
        return NextResponse.redirect(redirectUrl);
      }

      // 3. Gas op 'n publieke blad (/, /nuus, /winkel, /aansoek). Laat hulle toe.
      return supabaseResponse;
    }

    // --- GEBRUIKER IS INGETEKEN ---
    userId = user.id;

    // Kry hul rol uit die 'profiles' tabel
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    userRole = profile?.role || null;
    console.log(`Middleware: User ${userId} (Role: ${userRole}) accessing path: ${pathname}`);

    // 1. Hanteer Admin-roetes
    if (pathname.startsWith('/admin')) {
      if (userRole === 'admin') {
        // Admin in admin-area. Korrek.
        return supabaseResponse;
      }
      // Nie-admin (bv. 'parent') probeer /admin bykom. Stuur na hul eie portaal.
      console.warn(`Middleware: Non-admin (Role: ${userRole}) tried to access /admin. Redirecting to /portaal.`);
      return NextResponse.redirect(new URL('/portaal', request.url));
    }

    // 2. Hanteer Ouer Portaal-roetes
    if (pathname.startsWith('/portaal')) {
      if (userRole === 'parent') {
        // Ouer in ouer-area. Korrek.
        return supabaseResponse;
      }
      // Nie-ouer (bv. 'admin') probeer /portaal bykom. Stuur na hule eie portaal.
      console.warn(`Middleware: Non-parent (Role: ${userRole}) tried to access /portaal. Redirecting to /admin.`);
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    
    // 3. Hanteer Aanteken-bladsye
    // As 'n ingetekende gebruiker op 'n aantekenblad beland, stuur hulle na hul dashboard.
    if (pathname === '/login' || pathname === '/portaal/begin') {
      const dashboardUrl = userRole === 'admin' ? '/admin' : '/portaal';
      console.log(`Middleware: Logged-in user (Role: ${userRole}) on login page. Redirecting to ${dashboardUrl}.`);
      return NextResponse.redirect(new URL(dashboardUrl, request.url));
    }

    // 4. Ingetekende gebruiker op 'n publieke blad. Laat hulle toe.
    return supabaseResponse;

  } catch (error) {
    // Vang foute, maar laat versoek meestal toe om publieke blaaie te wys
    let errorMessage = 'No User Found (Guest)';
    if (error instanceof AuthApiError && error.code === 'refresh_token_not_found') {
      // Dit is 'n normale toestand vir 'n gas
    } else {
      console.error('Middleware Auth Error:', error);
    }
    console.log(`Middleware (catch): ${errorMessage} accessing path: ${pathname}`);
    
    // As 'n fout gebeur, is dit veiliger om gas-reëls toe te pas
    if (pathname.startsWith('/admin')) {
        return NextResponse.redirect(new URL('/login', request.url));
    }
    if (pathname.startsWith('/portaal') && pathname !== '/portaal/begin') {
        return NextResponse.redirect(new URL('/portaal/begin', request.url));
    }

    return supabaseResponse;
  }
}

export const config = {
  matcher: [
    /*
     * Pas by alle roetes, behalwe vir:
     * - _next/static (statiese lêers)
     * - _next/image (beeld-optimisering)
     * - favicon.ico (favicon)
     * - Enige lêers met 'n uitbreiding (bv. .svg, .png, .jpg, .jpeg, .gif, .webp)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};