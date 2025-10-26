import { prisma } from '@/lib/prisma/client'
import { generateToken } from './tokens'
import { DeviceInfo, SessionData, SessionUser } from '@/types/auth'
import { generateDeviceId } from '@/lib/security/device-fingerprint'
import { logger } from '@/lib/security/logger'
import { getCookie, setCookie } from 'cookies-next'
import { NextResponse } from 'next/server'

const SESSION_COOKIE_NAME = 'africonnect_session'
const SESSION_EXPIRY_HOURS = 24 // Default session length
const EXTENDED_SESSION_DAYS = 30 // "Remember me" session length

export async function getSession(sessionToken: string | null): Promise<SessionData | null> {
  try {
    if (!sessionToken) return null

    // Find session in database
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
          }
        }
      }
    })

    // If no session or expired, return null
    if (!session || !session.isActive || session.expiresAt < new Date()) {
      return null
    }

    // Update last activity
    await prisma.userSession.update({
      where: { id: session.id },
      data: { lastActivityAt: new Date() },
    })

    // Map to SessionData type
    return {
      id: session.id,
      token: session.sessionToken,
      userId: session.userId,
      user: session.user as SessionUser,
      deviceInfo: {
        deviceId: session.deviceId,
        userAgent: session.userAgent || '',
        ip: session.ipAddress || '',
        lastLogin: session.lastLoginAt
      },
      csrfToken: session.csrfToken,
      expiresAt: session.expiresAt,
      createdAt: session.createdAt
    }
  } catch (error) {
    logger.error('Error getting session:', error instanceof Error ? error.message : 'Unknown error')
    return null
  }
}

/**
 * Create a new session
 */
export async function createSession(
  userId: string,
  deviceInfo: DeviceInfo,
  rememberMe: boolean = false
): Promise<SessionData> {
  // Generate session token and device ID
  const sessionToken = await generateToken(32)
  const csrfToken = await generateToken(32)
  const deviceId = generateDeviceId(
    deviceInfo.userAgent || '',
    deviceInfo.ipAddress || ''
  )
  
  // Calculate expiry
  const expiresAt = new Date(
    Date.now() +
      (rememberMe ? EXTENDED_SESSION_DAYS * 24 : SESSION_EXPIRY_HOURS) * 60 * 60 * 1000
  )

  // Create session in database
  const session = await prisma.userSession.create({
    data: {
      userId,
      sessionToken,
      csrfToken,
      deviceId,
      deviceType: deviceInfo.deviceType,
      deviceName: deviceInfo.deviceName,
      browser: deviceInfo.browser,
      os: deviceInfo.os,
      ipAddress: deviceInfo.ipAddress,
      userAgent: deviceInfo.userAgent,
      expiresAt,
      isActive: true,
      lastLoginAt: new Date(),
      lastActivityAt: new Date(),
    },
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
        }
      }
    }
  })

  // Update user's last login
  await prisma.user.update({
    where: { id: userId },
    data: {
      lastLoginAt: new Date(),
      loginCount: { increment: 1 },
    },
  })

  // Set session cookie
  setSessionCookie(sessionToken, expiresAt)

  // Log session creation
  logger.info('auth', `Session created for user ${userId}`, {
    sessionId: session.id,
    deviceId: session.deviceId,
    expiresAt: session.expiresAt,
    rememberMe,
  })

  // Map to SessionData type
  return {
    id: session.id,
    token: session.sessionToken,
    userId: session.userId,
    user: session.user as SessionUser,
    deviceInfo: {
      deviceId: session.deviceId,
      userAgent: session.userAgent || '',
      ip: session.ipAddress || '',
      lastLogin: session.lastLoginAt
    },
    csrfToken: session.csrfToken,
    expiresAt: session.expiresAt,
    createdAt: session.createdAt
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

import { serialize } from 'cookie';

/**
 * Set session cookie in response
 */
export function setSessionCookie(sessionToken: string, expiresAt: Date): void {
  setCookie(SESSION_COOKIE_NAME, sessionToken, {
    path: '/',
    expires: expiresAt,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  })
}

/**
 * Get session cookie
 */
export function getSessionCookie(): string | undefined {
  const value = getCookie(SESSION_COOKIE_NAME)
  return typeof value === 'string' ? value : undefined
}

/**
 * Delete session cookie
 */
export function deleteSessionCookie(): void {
  setCookie(SESSION_COOKIE_NAME, '', {
    path: '/',
    expires: new Date(0),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  })
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