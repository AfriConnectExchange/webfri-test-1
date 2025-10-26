import { prisma } from '@/lib/prisma/client'
import { generateToken } from './tokens'
import { DeviceInfo } from '@/types/auth'
import { generateDeviceId } from '@/lib/security/device-fingerprint'
import { logger } from '@/lib/security/logger'
import { SessionData, SessionUser } from '@/types/auth'
import { cookies } from 'next/headers'

const SESSION_COOKIE_NAME = 'africonnect_session'
const SESSION_EXPIRY_HOURS = 24
const REMEMBER_ME_DAYS = 30

/**
 * Create a new session
 */
export async function createSession(
  userId: string,
  deviceInfo: DeviceInfo,
  rememberMe: boolean = false
): Promise<{ sessionToken: string; expiresAt: Date }> {
  const sessionToken = generateToken(32)
  const expiresAt = new Date(
    Date.now() +
      (rememberMe ? REMEMBER_ME_DAYS * 24 : SESSION_EXPIRY_HOURS) * 60 * 60 * 1000
  )

  const deviceId = generateDeviceId(
    deviceInfo.userAgent || '',
    deviceInfo.ipAddress || ''
  )

  // Create session in database
  await prisma.userSession.create({
    data: {
      userId,
      deviceId,
      deviceType: deviceInfo.deviceType,
      deviceName: deviceInfo.deviceName,
      browser: deviceInfo.browser,
      os: deviceInfo.os,
      ipAddress: deviceInfo.ipAddress,
      userAgent: deviceInfo.userAgent,
      sessionToken,
      expiresAt,
      isActive: true,
    },
  })

  // Update user's last login
  await prisma.user.update({
    where: { id: userId },
    data: {
      lastLoginAt: new Date(),
      loginCount: { increment: 1 },
    },
  })

  logger.info('auth', `Session created for user ${userId}`, {
    deviceId,
    expiresAt,
    rememberMe,
  })

  return { sessionToken, expiresAt }
}

/**
 * Get session by token
 */
export async function getSession(sessionToken: string): Promise<SessionData | null> {
  const session = await prisma.userSession.findUnique({
    where: { sessionToken },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          fullName: true,
          profilePictureUrl: true,
          roles: true,
          status: true,
          verificationStatus: true,
          emailVerified: true,
          phoneVerified: true,
        },
      },
    },
  })

  if (!session || !session.isActive) {
    return null
  }

  // Check if session has expired
  if (new Date() > session.expiresAt) {
    await deleteSession(sessionToken)
    return null
  }

  // Update last activity
  await prisma.userSession.update({
    where: { id: session.id },
    data: { lastActivityAt: new Date() },
  })

  return {
    user: session.user as SessionUser,
    sessionId: session.id,
    expiresAt: session.expiresAt,
  }
}

/**
 * Delete a session (sign out)
 */
export async function deleteSession(sessionToken: string): Promise<void> {
  await prisma.userSession.updateMany({
    where: { sessionToken },
    data: {
      isActive: false,
      revokedAt: new Date(),
    },
  })

  logger.info('auth', 'Session deleted', { sessionToken })
}

/**
 * Delete all sessions for a user
 */
export async function deleteAllUserSessions(userId: string): Promise<void> {
  await prisma.userSession.updateMany({
    where: { userId },
    data: {
      isActive: false,
      revokedAt: new Date(),
    },
  })

  logger.info('auth', `All sessions deleted for user ${userId}`)
}

/**
 * Refresh session (extend expiry)
 */
export async function refreshSession(
  sessionToken: string,
  extendBy: number = SESSION_EXPIRY_HOURS
): Promise<Date | null> {
  const session = await prisma.userSession.findUnique({
    where: { sessionToken },
  })

  if (!session || !session.isActive) {
    return null
  }

  const newExpiresAt = new Date(Date.now() + extendBy * 60 * 60 * 1000)

  await prisma.userSession.update({
    where: { id: session.id },
    data: {
      expiresAt: newExpiresAt,
      lastActivityAt: new Date(),
    },
  })

  return newExpiresAt
}

/**
 * Set session cookie
 */
export async function setSessionCookie(sessionToken: string, expiresAt: Date): Promise<void> {
  const cookieStore = await cookies()
  
  cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt,
    path: '/',
  })
}

/**
 * Get session cookie
 */
export async function getSessionCookie(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get(SESSION_COOKIE_NAME)?.value
}

/**
 * Delete session cookie
 */
export async function deleteSessionCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}

/**
 * Get current user from session cookie
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const sessionToken = await getSessionCookie()
  
  if (!sessionToken) {
    return null
  }

  const session = await getSession(sessionToken)
  return session?.user || null
}

/**
 * Clean up expired sessions (run as cron job)
 */
export async function cleanupExpiredSessions(): Promise<number> {
  const result = await prisma.userSession.updateMany({
    where: {
      expiresAt: { lt: new Date() },
      isActive: true,
    },
    data: {
      isActive: false,
    },
  })

  logger.info('auth', `Cleaned up ${result.count} expired sessions`)
  return result.count
}