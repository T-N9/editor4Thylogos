import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';

export function middleware(req: NextRequest) {
  const {pathname} = req.nextUrl;
  const token = req.cookies.get('authToken')?.value;

  if (pathname.startsWith('/manage')) {

    if (!token) {
      return NextResponse.redirect(new URL('/log-in', req.url));
    }
  }

  if (pathname.startsWith('/log-in') && token) {
    return NextResponse.redirect(new URL('/manage', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/manage/:path*', '/log-in'], // Protect all routes under /manage
};
