import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma/client'
import { verifyPassword } from '@/lib/auth/password'
import { createSession, setSessionCookie } from '@/lib/auth/session'
import { validateSchema, signInEmailSchema, signInPhoneSchema } from '@/lib/utils/validation'
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/utils/response'
import { UnauthorizedError } from '@/lib/utils/errors'
import { checkRateLimit, logRateLimitAttempt, logSuspiciousActivity } from '@/lib/security/rate-limit'
import { getDeviceInfo } from '@/lib/security/device-fingerprint'
import { logger } from '@/lib/security/logger'
import { logActivity } from '@/lib/security/logger'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const deviceInfo = await getDeviceInfo()

    // Determine signin method (email or phone)
    const isPhoneSignin = !!body.phone

    // Validate input
    const validation = isPhoneSignin
      ? validateSchema(signInPhoneSchema, body)
      : validateSchema(signInEmailSchema, body)

    if (!validation.success) {
      return validationErrorResponse(validation.errors!)
    }

    const data = validation.data!
    const identifier = isPhoneSignin ? data.phone : data.email

    // Check rate limit (5 attempts per 15 minutes)
    await checkRateLimit(identifier, 'login')

    // Find user
    const user = await prisma.user.findFirst({
      where: isPhoneSignin
        ? { phone: data.phone }
        : { email: data.email },
    })

    if (!user || !user.passwordHash) {
      // Log suspicious activity
      await logSuspiciousActivity(
        'failed_login',
        `Failed login attempt for ${identifier}`,
        undefined,
        deviceInfo.ipAddress,
        deviceInfo.userAgent
      )

      await logRateLimitAttempt(identifier, 'login', undefined, {
        success: false,
        reason: 'user_not_found',
      })

      throw new UnauthorizedError('Invalid credentials')
    }

    // Verify password
    const isValidPassword = await verifyPassword(data.password, user.passwordHash)

    if (!isValidPassword) {
      await logSuspiciousActivity(
        'failed_login',
        `Invalid password for ${identifier}`,
        user.id,
        deviceInfo.ipAddress,
        deviceInfo.userAgent
      )

      await logRateLimitAttempt(identifier, 'login', user.id, {
        success: false,
        reason: 'invalid_password',
      })

      throw new UnauthorizedError('Invalid credentials')
    }

    // Check if user is active
    if (user.status === 'suspended') {
      throw new UnauthorizedError('Your account has been suspended. Please contact support.')
    }

    if (user.status === 'deleted' || user.status === 'deactivated') {
      throw new UnauthorizedError('Your account is no longer active')
    }

    // Check if email/phone is verified
    const isVerified = isPhoneSignin ? user.phoneVerified : user.emailVerified

    if (!isVerified) {
      return successResponse(
        {
          userId: user.id,
          verified: false,
          needsVerification: true,
          verificationType: isPhoneSignin ? 'phone' : 'email',
          message: `Please verify your ${isPhoneSignin ? 'phone number' : 'email'} before signing in.`,
        },
        'Verification required'
      )
    }

    // Create session
    const { sessionToken, expiresAt } = await createSession(
      user.id,
      deviceInfo,
      body.rememberMe || false
    )

    // Set session cookie
    await setSessionCookie(sessionToken, expiresAt)

    // Log successful login
    await logRateLimitAttempt(identifier, 'login', user.id, {
      success: true,
    })

    await logActivity(
      user.id,
      'login',
      'user',
      user.id,
      { method: isPhoneSignin ? 'phone' : 'email' },
      undefined,
      deviceInfo.ipAddress,
      deviceInfo.userAgent
    )

    logger.info('auth', `User ${user.id} signed in successfully`, {
      method: isPhoneSignin ? 'phone' : 'email',
    })

    return successResponse({
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        profilePictureUrl: user.profilePictureUrl,
        roles: user.roles,
        status: user.status,
      },
      sessionToken,
      expiresAt,
    })
  } catch (error) {
    logger.error('auth', 'Signin error', error as Error)
    return errorResponse(error)
  }
}