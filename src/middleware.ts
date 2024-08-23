// middleware.ts
import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';

export function middleware(req: NextRequest) {
  const {pathname} = req.nextUrl;
  const token = req.cookies.get('authToken')?.value;

  // Only protect routes that start with '/manage'
  if (pathname.startsWith('/manage')) {
    // If no token, redirect to login
    if (!token) {
      return NextResponse.redirect(new URL('/log-in', req.url));
    }
  }

  if (pathname.startsWith('/log-in') && token) {
    // If the user is already logged in, redirect them to the /manage page
    return NextResponse.redirect(new URL('/manage', req.url));
  }

  // Allow the request to proceed if authenticated
  return NextResponse.next();
}

export const config = {
  matcher: ['/manage/:path*', '/log-in'], // Protect all routes under /manage
};
