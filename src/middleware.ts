import { NextRequest, NextResponse } from 'next/server';
import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  id: string;
  role: 'TENANT' | 'LANDLORD' | 'ADMIN';
  exp: number;
}

const roleHomeMap: Record<string, string> = {
  TENANT: '/dashboard/tenant',
  LANDLORD: '/dashboard/landlord',
  ADMIN: '/dashboard/admin',
};

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;
  const { pathname } = request.nextUrl;

  if (!token) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const decoded = jwtDecode<TokenPayload>(token);

    const isExpired = decoded.exp * 1000 < Date.now();
    if (isExpired) {
      const loginUrl = new URL('/auth/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    if (pathname.startsWith('/dashboard/tenant') && decoded.role !== 'TENANT') {
      return NextResponse.redirect(
        new URL(roleHomeMap[decoded.role], request.url),
      );
    }
    if (
      pathname.startsWith('/dashboard/landlord') &&
      decoded.role !== 'LANDLORD'
    ) {
      return NextResponse.redirect(
        new URL(roleHomeMap[decoded.role], request.url),
      );
    }
    if (pathname.startsWith('/dashboard/admin') && decoded.role !== 'ADMIN') {
      return NextResponse.redirect(
        new URL(roleHomeMap[decoded.role], request.url),
      );
    }
  } catch {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
