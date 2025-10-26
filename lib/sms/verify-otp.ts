import { prisma } from '@/lib/prisma/client'
import { verifyToken, isTokenExpired } from '@/lib/auth/tokens'
import { logger } from '@/lib/security/logger'
import { ValidationError, UnauthorizedError } from '@/lib/utils/errors'

interface VerifyOTPResult {
  success: boolean
  message: string
  valid: boolean
}

/**
 * Verify OTP for a phone number
 */
export async function verifyOTP(phone: string, code: string): Promise<VerifyOTPResult> {
  try {
    // Find the latest unused OTP for this phone
    const otpRecord = await prisma.otpToken.findFirst({
      where: {
        phone,
        used: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    if (!otpRecord) {
      logger.warning('sms', `No OTP found for phone ${phone}`)
      return {
        success: false,
        valid: false,
        message: 'Invalid or expired OTP',
      }
    }

    // Check if OTP has expired
    if (isTokenExpired(otpRecord.expiresAt)) {
      logger.warning('sms', `Expired OTP used for phone ${phone}`)
      
      // Delete expired OTP
      await prisma.otpToken.delete({
        where: { id: otpRecord.id },
      })

      return {
        success: false,
        valid: false,
        message: 'OTP has expired. Please request a new one.',
      }
    }

    // Verify the OTP code
    const isValid = await verifyToken(code, otpRecord.tokenHash)

    if (!isValid) {
      logger.warning('sms', `Invalid OTP attempt for phone ${phone}`)
      return {
        success: false,
        valid: false,
        message: 'Invalid OTP code',
      }
    }

    // Mark OTP as used
    await prisma.otpToken.update({
      where: { id: otpRecord.id },
      data: { used: true },
    })

    logger.info('sms', `OTP verified successfully for phone ${phone}`)

    return {
      success: true,
      valid: true,
      message: 'OTP verified successfully',
    }
  } catch (error) {
    logger.error('sms', `Error verifying OTP for phone ${phone}`, error as Error)
    
    return {
      success: false,
      valid: false,
      message: 'An error occurred while verifying OTP',
    }
  }
}

/**
 * Check if phone has valid pending OTP
 */
export async function hasValidOTP(phone: string): Promise<boolean> {
  const otpRecord = await prisma.otpToken.findFirst({
    where: {
      phone,
      used: false,
      expiresAt: {
        gt: new Date(),
      },
    },
  })

  return !!otpRecord
}