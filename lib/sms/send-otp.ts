import { prisma } from '@/lib/prisma/client'
import { generateOTPWithHash, getExpiryDate } from '@/lib/auth/tokens'
import { sendSMS } from './client'
import { logger } from '@/lib/security/logger'
import { checkRateLimit, logRateLimitAttempt } from '@/lib/security/rate-limit'
import { RateLimitError } from '@/lib/utils/errors'

interface SendOTPResult {
  success: boolean
  message: string
  expiresAt?: Date
}

/**
 * Send OTP to phone number
 */
export async function sendOTP(phone: string, userId?: string): Promise<SendOTPResult> {
  try {
    // Check rate limit (3 OTPs per hour)
    await checkRateLimit(phone, 'otp')

    // Generate OTP and hash
    const { otp, hash } = await generateOTPWithHash()
    const expiresAt = getExpiryDate(5) // 5 minutes expiry

    // Store OTP in database
    await prisma.otpToken.create({
      data: {
        phone,
        tokenHash: hash,
        expiresAt,
        used: false,
      },
    })

    // Send SMS
    const smsMessage = `Your AfriConnect Exchange verification code is: ${otp}\n\nThis code expires in 5 minutes.\n\nIf you didn't request this, please ignore this message.`

    const smsSent = await sendSMS({
      to: phone,
      message: smsMessage,
    })

    // Log the attempt
    await logRateLimitAttempt(phone, 'otp', userId, {
      success: smsSent,
      expiresAt,
    })

    if (!smsSent) {
      logger.error('sms', `Failed to send OTP to ${phone}`, undefined, {
        userId,
      })
      return {
        success: false,
        message: 'Failed to send OTP. Please try again.',
      }
    }

    logger.info('sms', `OTP sent successfully to ${phone}`, {
      userId,
      expiresAt,
    })

    return {
      success: true,
      message: 'OTP sent successfully',
      expiresAt,
    }
  } catch (error) {
    if (error instanceof RateLimitError) {
      throw error
    }

    logger.error('sms', `Error sending OTP to ${phone}`, error as Error, {
      userId,
    })

    return {
      success: false,
      message: 'An error occurred while sending OTP',
    }
  }
}

/**
 * Resend OTP (with rate limiting)
 */
export async function resendOTP(phone: string, userId?: string): Promise<SendOTPResult> {
  // Delete any unused OTPs for this phone
  await prisma.otpToken.deleteMany({
    where: {
      phone,
      used: false,
    },
  })

  // Send new OTP
  return sendOTP(phone, userId)
}

/**
 * Clean up expired OTPs (can be run as a cron job)
 */
export async function cleanupExpiredOTPs(): Promise<number> {
  const result = await prisma.otpToken.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  })

  logger.info('sms', `Cleaned up ${result.count} expired OTPs`)
  return result.count
}