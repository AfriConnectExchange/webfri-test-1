import { NextRequest } from 'next/server'
import { getSessionCookie, deleteSession, deleteSessionCookie } from '@/lib/auth/session'
import { successResponse, errorResponse } from '@/lib/utils/response'
import { logger } from '@/lib/security/logger'
import { logActivity } from '@/lib/security/logger'

export async function POST(request: NextRequest) {
  try {
    const sessionToken = await getSessionCookie()

    if (!sessionToken) {
      return successResponse({ message: 'No active session' })
    }

    // Delete session from database
    await deleteSession(sessionToken)

    // Delete session cookie
    await deleteSessionCookie()

    logger.info('auth', 'User signed out successfully')

    return successResponse({ message: 'Signed out successfully' })
  } catch (error) {
    logger.error('auth', 'Signout error', error as Error)
    return errorResponse(error)
  }
}