import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma/client'
import { generateVerificationToken } from '@/lib/auth/tokens'
import { validateSchema, forgotPasswordSchema } from '@/lib/utils/validation'
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/utils/response'
import { NotFoundError, RateLimitError } from '@/lib/utils/errors'
import { checkRateLimit, logRateLimitAttempt } from '@/lib/security/rate-limit'
import { sendEmailWithLogging } from '@/lib/email/send'
import VerificationEmail from '@/lib/email/templates/verification-email'
import { logger } from '@/lib/security/logger'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate email
    const validation = validateSchema(forgotPasswordSchema, body)
    if (!validation.success) {
      return validationErrorResponse(validation.errors!)
    }

    const { email } = validation.data!

    // Check rate limit (1 resend per 5 minutes)
    await checkRateLimit(email, 'email')

    // Find user
    const user = await prisma.user.findFirst({
      where: { email },
    })

    if (!user) {
      throw new NotFoundError('No account found with this email')
    }

    // Check if already verified
    if (user.emailVerified) {
      return successResponse({
        message: 'Email is already verified. You can sign in.',
      })
    }

    // Delete any existing tokens for this email
    await prisma.verificationToken.deleteMany({
      where: { identifier: email },
    })

    // Generate new token
    const { token, hash } = await generateVerificationToken()

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: hash,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    })

    const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify-email?token=${token}`

    // Send verification email
    await sendEmailWithLogging({
      to: email,
      subject: 'Verify your email - AfriConnect Exchange',
      template: VerificationEmail({
        userName: user.fullName || 'there',
        verificationLink,
      }),
      userId: user.id,
      templateName: 'verification-email',
    })

    // Log the attempt
    await logRateLimitAttempt(email, 'email', user.id, {
      action: 'resend_verification',
    })

    logger.info('auth', `Verification email resent to ${email}`)

    return successResponse({
      message: 'Verification email sent. Please check your inbox.',
    })
  } catch (error) {
    logger.error('auth', 'Resend verification error', error as Error)
    return errorResponse(error)
  }
}