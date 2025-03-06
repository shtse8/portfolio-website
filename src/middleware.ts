import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { VALID_URL_SECTIONS } from './lib/constants';

export function middleware(request: NextRequest) {
  // Get the path without query string or trailing slash
  const path = request.nextUrl.pathname;
  
  // If it's the root path or a valid section, allow it
  if (path === '/' || VALID_URL_SECTIONS.includes(path.substring(1))) {
    return NextResponse.next();
  }
  
  // Otherwise, redirect to the home page
  return NextResponse.redirect(new URL('/', request.url));
}

// Match all paths except api routes, _next, public files, etc.
export const config = {
  matcher: [
    /*
     * Match all paths except:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (static files)
     * 4. /_vercel (Vercel internals)
     * 5. /favicon.ico, /robots.txt, etc.
     */
    '/((?!api|_next|_static|_vercel|[\\w-]+\\.\\w+).*)',
  ],
}; 