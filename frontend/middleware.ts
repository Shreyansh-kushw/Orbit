import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth')
  const isCreatePage = request.nextUrl.pathname.startsWith('/create')
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (!token && isCreatePage){
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/auth/:path*', '/create/:path*', '/create'],
}