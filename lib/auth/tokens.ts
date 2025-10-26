import crypto from 'crypto'
import bcrypt from 'bcryptjs'

/**
 * Generate a secure random token
 */
export function generateToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex')
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
 * Generate a verification token and its hash
 */
export async function generateVerificationToken(): Promise<{
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