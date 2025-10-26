import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma/client'
import { addHours, addDays } from 'date-fns'

/**
 * Generate a secure random token
 */
export function generateToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex')
}

/**
 * Generate an email verification token
 */
export async function generateVerificationToken(userId: string): Promise<string> {
  const token = generateToken()
  const hashedToken = await bcrypt.hash(token, 10)
  
  await prisma.verificationToken.create({
    data: {
      userId,
      token: hashedToken,
      expiresAt: addHours(new Date(), 24) // 24 hour expiry
    }
  })

  return token
}

/**
 * Verify an email verification token
 */
export async function verifyEmailToken(token: string): Promise<string | null> {
  const hashedTokens = await prisma.verificationToken.findMany({
    where: {
      expiresAt: { gt: new Date() }
    }
  })

  for (const record of hashedTokens) {
    const isValid = await bcrypt.compare(token, record.token)
    if (isValid) {
      await prisma.verificationToken.delete({
        where: { id: record.id }
      })
      return record.userId
    }
  }

  return null
}

/**
 * Generate a password reset token
 */
export async function generatePasswordResetToken(userId: string): Promise<string> {
  const token = generateToken()
  const hashedToken = await bcrypt.hash(token, 10)

  await prisma.passwordResetToken.create({
    data: {
      userId,
      token: hashedToken,
      expiresAt: addHours(new Date(), 1) // 1 hour expiry
    }
  })

  return token
}

/**
 * Verify a password reset token
 */
export async function verifyPasswordResetToken(token: string): Promise<string | null> {
  const hashedTokens = await prisma.passwordResetToken.findMany({
    where: {
      expiresAt: { gt: new Date() }
    }
  })

  for (const record of hashedTokens) {
    const isValid = await bcrypt.compare(token, record.token)
    if (isValid) {
      await prisma.passwordResetToken.delete({
        where: { id: record.id }
      })
      return record.userId
    }
  }

  return null
}

/**
 * Generate a CSRF token
 */
export function generateCsrfToken(): string {
  return generateToken(32)
}

/**
 * Generate an API key
 */
export async function generateApiKey(userId: string, name: string): Promise<string> {
  const key = `ak_${generateToken(32)}`
  const hashedKey = await bcrypt.hash(key, 10)

  await prisma.apiKey.create({
    data: {
      userId,
      name,
      key: hashedKey,
      expiresAt: addDays(new Date(), 365) // 1 year expiry
    }
  })

  return key
}

/**
 * Verify an API key
 */
export async function verifyApiKey(key: string): Promise<string | null> {
  const apiKeys = await prisma.apiKey.findMany({
    where: {
      expiresAt: { gt: new Date() },
      revoked: false
    }
  })

  for (const apiKey of apiKeys) {
    const isValid = await bcrypt.compare(key, apiKey.key)
    if (isValid) {
      return apiKey.userId
    }
  }

  return null
}

/**
 * Generate a 6-digit OTP
 */
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

/**
 * Hash a token (for storing in database)
 */
export async function hashToken(token: string): Promise<string> {
  return bcrypt.hash(token, 10)
}

/**
 * Verify a token against a hash
 */
export async function verifyToken(
  token: string,
  hashedToken: string
): Promise<boolean> {
  return bcrypt.compare(token, hashedToken)
}

/**
 * Generate a token and its hash for verification purposes
 */
export async function generateTokenWithHash(): Promise<{
  token: string
  hash: string
}> {
  const token = generateToken(32)
  const hash = await hashToken(token)
  return { token, hash }
}

/**
 * Generate an OTP and its hash
 */
export async function generateOTPWithHash(): Promise<{
  otp: string
  hash: string
}> {
  const otp = generateOTP()
  const hash = await hashToken(otp)
  return { otp, hash }
}

/**
 * Check if a token has expired
 */
export function isTokenExpired(expiresAt: Date): boolean {
  return new Date() > expiresAt
}

/**
 * Calculate expiry date from now
 */
export function getExpiryDate(minutes: number): Date {
  return new Date(Date.now() + minutes * 60 * 1000)
}