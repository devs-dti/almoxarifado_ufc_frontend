import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_ROUTES = ['/', '/login', '/forgot-password', '/faq', '/desenvolvedores']
const RESET_PASSWORD_PREFIX = '/reset-password'

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl
  const token = req.cookies.get('accessCookie')?.value

  if (searchParams.get('clear') === '1') {
    const response = NextResponse.redirect(new URL('/login', req.url))
    response.cookies.delete('accessCookie')
    return response
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
  matcher: ['/((?!_next|api|favicon\\.ico|mockServiceWorker\\.js|.*\\.(?:png|jpg|jpeg|webp|svg|ico)).*)'],
}
