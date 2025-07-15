import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedRoutes = ['/profile', '/upload'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  if (protectedRoutes.includes(request.nextUrl.pathname) && !token) {
    const absoluteURL = new URL('/auth', request.nextUrl.origin)
    return NextResponse.redirect(absoluteURL.toString())
  }
  
  if (request.nextUrl.pathname === '/auth' && token) {
     const absoluteURL = new URL('/profile', request.nextUrl.origin)
    return NextResponse.redirect(absoluteURL.toString())
  }
}
