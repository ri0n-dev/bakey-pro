import { type NextRequest } from 'next/server'
import { updateSession } from '@/libs/SupabaseMiddlewere'

export function middleware(request: NextRequest) {
  return updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
