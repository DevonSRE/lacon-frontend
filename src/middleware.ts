import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/server/auth";
import {
  defaultLoginRedirect,
  apiAuthPrefix,
  apiPrefix,
  authRoutes,
  publicRoutes,
} from '@/routes'

export async function middleware(request: NextRequest) {
  const { nextUrl } = request;
  const { pathname } = nextUrl;

  // Verify session first (more reliable than getUser alone)
  const session = await verifySession();
  const isLoggedIn = !!session;
  const user = session?.user;

  const isApiAuthRoute = pathname.startsWith(apiAuthPrefix);
  const isApiRoute = pathname.startsWith(apiPrefix);
  const isAuthRoute = authRoutes.includes(pathname);
  const isProbunoRoute = pathname.startsWith("/probuno");

  const isPublicRoute = isProbunoRoute || publicRoutes.some(route => {
    if (route === '/') return pathname === '/';
    return pathname.startsWith(route);
  });

  // 1. Allow all API routes to pass through
  if (isApiRoute || isApiAuthRoute) {
    return NextResponse.next();
  }

  // 2. Handle auth routes (login, register, etc.)
  if (isAuthRoute) {
    // Redirect logged-in users away from auth pages
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(defaultLoginRedirect(user?.role), nextUrl));
    }
    // Allow unauthenticated access to auth pages
    return NextResponse.next();
  }

  // 3. Allow public routes
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // 4. Protect private routes
  if (!isLoggedIn) {
    // Store the attempted URL for redirect after login
    const signInUrl = new URL('/signin', nextUrl);
    signInUrl.searchParams.set('callbackUrl', nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  // 5. Role-based access control could be added here if needed
  // if (pathname.startsWith('/admin') && user?.role !== 'ADMIN') {
  //   return NextResponse.redirect(new URL('/unauthorized', nextUrl));
  // }

  // Default: allow access
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};

// import { NextRequest, NextResponse } from "next/server";
// import { getUser, verifySession } from "@/server/auth";

// import {
//   defaultLoginRedirect,
//   apiAuthPrefix,
//   apiPrefix,
//   authRoutes,
//   publicRoutes,
// } from '@/routes'

// export async function middleware(request: NextRequest) {
//   const nextUrl = request.nextUrl;
//   const pathname = nextUrl.pathname;

//   const isLoggedIn = !!(await getUser());
//   const session = await verifySession();
//   const user = session?.user;

//   const isApiAuthRoute = pathname.startsWith(apiAuthPrefix);
//   const isApiRoute = pathname.startsWith(apiPrefix);
//   const isAuthRoute = authRoutes.includes(pathname);


//   const isProbunoRoute = pathname.startsWith("/probuno");

//   const isPublicRoute = isProbunoRoute || publicRoutes.some(route => {
//     if (route === '/') return pathname === '/';
//     return pathname.startsWith(route);
//   });


//   // Allow all API and API auth routes
//   if (isApiAuthRoute || isApiRoute) {
//     return NextResponse.next();
//   }

//   // Redirect logged-in users away from auth-only pages
//   if (isAuthRoute && isLoggedIn) {
//     return NextResponse.redirect(new URL(defaultLoginRedirect(user?.role), nextUrl));
//   }

//   // Allow unauthenticated access to public routes
//   if (isPublicRoute) {
//     return NextResponse.next();
//   }

//   // Block access to auth routes if not logged in
//   if (isAuthRoute && !isLoggedIn) {
//     return NextResponse.next();
//   }



//   // Redirect unauthenticated users from protected pages
//   if (!isLoggedIn) {
//     return NextResponse.redirect(new URL('/signin', nextUrl));
//   }

//   // Default: allow
//   return NextResponse.next();
// }

// export const config = {
//   matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
// };
