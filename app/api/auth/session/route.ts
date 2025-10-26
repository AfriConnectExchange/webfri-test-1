import { NextRequest } from 'next/server'
import { getCurrentUser } from '@/lib/auth/session'
import { successResponse, errorResponse } from '@/lib/utils/response'
import { UnauthorizedError } from '@/lib/utils/errors'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      throw new UnauthorizedError('Not authenticated')
    }

    return successResponse({ user })
  } catch (error) {
    return errorResponse(error)
  }
} 