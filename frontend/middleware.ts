import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth')
  const isCreatePage = request.nextUrl.pathname.startsWith('/create')
  const isSettingsPage = request.nextUrl.pathname.startsWith('/settings')

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (!token && (isCreatePage || isSettingsPage)){
    const loginUrl = new URL('/auth', request.url)
    // Add the current path as a return_to parameter to improve UX
    loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/auth/:path*', '/create/:path*', '/create', '/settings/:path*', '/settings'],
}