import { prisma } from '@/lib/prisma/client'
import { RateLimitError } from '@/lib/utils/errors'

interface RateLimitConfig {
  maxAttempts: number
  windowMinutes: number
}

const RATE_LIMITS: Record<string, RateLimitConfig> = {
  login: { maxAttempts: 5, windowMinutes: 15 },
  signup: { maxAttempts: 3, windowMinutes: 60 },
  otp: { maxAttempts: 3, windowMinutes: 60 },
  email: { maxAttempts: 5, windowMinutes: 60 },
  passwordReset: { maxAttempts: 3, windowMinutes: 60 },
}

/**
 * Check rate limit for an action
 * Uses security_logs table to track attempts
 */
export async function checkRateLimit(
  identifier: string, // IP address, email, or phone
  action: keyof typeof RATE_LIMITS
): Promise<void> {
  const config = RATE_LIMITS[action]
  const windowStart = new Date(Date.now() - config.windowMinutes * 60 * 1000)

  // Count attempts in the time window
  const attempts = await prisma.securityLog.count({
    where: {
      eventType: action,
      eventDescription: { contains: identifier },
      createdAt: { gte: windowStart },
    },
  })

  if (attempts >= config.maxAttempts) {
    throw new RateLimitError(
      `Too many ${action} attempts. Please try again in ${config.windowMinutes} minutes.`
    )
  }
}

/**
 * Log a rate-limited action attempt
 */
export async function logRateLimitAttempt(
  identifier: string,
  action: string,
  userId?: string,
  metadata?: Record<string, any>
): Promise<void> {
  await prisma.securityLog.create({
    data: {
      eventType: action,
      eventDescription: `${action} attempt for ${identifier}`,
      userId: userId || null,
      severity: 'info',
      isSuspicious: false,
      metadata: metadata || {},
    },
  })
}

/**
 * Log a suspicious activity
 */
export async function logSuspiciousActivity(
  eventType: string,
  description: string,
  userId?: string,
  ipAddress?: string,
  userAgent?: string,
  metadata?: Record<string, any>
): Promise<void> {
  await prisma.securityLog.create({
    data: {
      eventType,
      eventDescription: description,
      userId: userId || null,
      ipAddress: ipAddress || null,
      userAgent: userAgent || null,
      severity: 'warning',
      isSuspicious: true,
      metadata: metadata || {},
    },
  })
}