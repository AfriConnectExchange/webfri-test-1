import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma/client'
import { hashPassword } from '@/lib/auth/password'
import { generateTokenWithHash } from '@/lib/auth/tokens'
import { validateSchema, signUpEmailSchema, signUpPhoneSchema } from '@/lib/utils/validation'
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/utils/response'
import { ValidationError, AuthError } from '@/lib/utils/errors'
import { checkRateLimit, logRateLimitAttempt } from '@/lib/security/rate-limit'
import { getDeviceInfo } from '@/lib/security/device-fingerprint'
import { sendEmailWithLogging } from '@/lib/email/send'
import VerificationEmail from '@/lib/email/templates/verification-email'
import { sendOTP } from '@/lib/sms/send-otp'
import { logger } from '@/lib/security/logger'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const deviceInfo = await getDeviceInfo()

    // Determine signup method (email or phone)
    const isPhoneSignup = !!body.phone

    // Validate input
    const validation = isPhoneSignup
      ? validateSchema(signUpPhoneSchema, body)
      : validateSchema(signUpEmailSchema, body)

    if (!validation.success) {
      return validationErrorResponse(validation.errors!)
    }

    const data = validation.data!

    // Check rate limit
    const identifier = isPhoneSignup ? data.phone : data.email
    await checkRateLimit(identifier, 'signup')

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: isPhoneSignup
        ? { phone: data.phone }
        : { email: data.email },
    })

    if (existingUser) {
      throw new ValidationError(
        isPhoneSignup
          ? 'An account with this phone number already exists'
          : 'An account with this email already exists'
      )
    }

    // Hash password
    const passwordHash = await hashPassword(data.password)

    // Create user
    const user = await prisma.user.create({
      data: {
        fullName: data.fullName,
        email: isPhoneSignup ? null : data.email,
        phone: isPhoneSignup ? data.phone : null,
        passwordHash,
        roles: [data.role],
        status: 'pending', // User must verify before active
        verificationStatus: 'unverified',
      },
    })

    // Log the signup attempt
    await logRateLimitAttempt(identifier, 'signup', user.id, {
      method: isPhoneSignup ? 'phone' : 'email',
      role: data.role,
    })

    // Send verification based on signup method
    if (isPhoneSignup) {
      // Send OTP via SMS
      const otpResult = await sendOTP(data.phone, user.id)
      
      if (!otpResult.success) {
        throw new AuthError('Failed to send verification code', 'OTP_SEND_FAILED', 500)
      }

      return successResponse(
        {
          userId: user.id,
          phone: data.phone,
          message: 'Account created. Please verify your phone number.',
        },
        'Account created successfully',
        201
      )
    } else {
      // Send verification email
      const { token, hash } = await generateTokenWithHash()
      
      // Store verification token
      await prisma.verificationToken.create({
        data: {
          identifier: data.email,
          token: hash,
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        },
      })

      const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify-email?token=${token}`

      await sendEmailWithLogging({
        to: data.email,
        subject: 'Verify your email - AfriConnect Exchange',
        template: VerificationEmail({
          userName: data.fullName,
          verificationLink,
        }),
        userId: user.id,
        templateName: 'verification-email',
      })

      return successResponse(
        {
          userId: user.id,
          email: data.email,
          message: 'Account created. Please check your email to verify your account.',
        },
        'Account created successfully',
        201
      )
    }
  } catch (error) {
    logger.error('auth', 'Signup error', error as Error)
    return errorResponse(error)
  }
}