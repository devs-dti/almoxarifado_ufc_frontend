import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_ROUTES = ['/login', '/forgot-password']
const RESET_PASSWORD_PREFIX = '/reset-password'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = req.cookies.get('auth-token')?.value

  if (pathname === '/') {
    return NextResponse.redirect(new URL(token ? '/dashboard' : '/login', req.url))
  }

  const isPublic =
    PUBLIC_ROUTES.includes(pathname) || pathname.startsWith(RESET_PASSWORD_PREFIX)

  if (!token && !isPublic) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (token && pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next|api|favicon\\.ico|mockServiceWorker\\.js|.*\\.png|.*\\.svg).*)'],
}
