import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export { default } from 'next-auth/middleware';

export const config = {
  matcher: ['/dashboard/:path*', '/sign-in', '/sign-up', '/'],
};

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const url = request.nextUrl;

  console.log('Token:', token);
  console.log('URL Path:', url.pathname);

  // Redirect to dashboard if the user is already authenticated
  if (token && (url.pathname === '/sign-in' || url.pathname === '/sign-up' || url.pathname === '/')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Redirect to sign-in if user is trying to access dashboard without a token
  if (!token && url.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return NextResponse.next();
}
