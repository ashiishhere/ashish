import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

// Protects every /admin route except /admin/login.
// Unauthenticated visitors are redirected to /admin/login.
export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        if (req.nextUrl.pathname.startsWith('/admin/login')) return true;
        return !!token;
      },
    },
    pages: {
      signIn: '/admin/login',
    },
  }
);

export const config = {
  matcher: ['/admin/:path*'],
};
