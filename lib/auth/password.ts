import bcrypt from 'bcryptjs'

const SALT_ROUNDS = 10

/**
 * Hash a plain text password
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

/**
 * Compare a plain text password with a hashed password
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

/**
 * Check if a password is strong enough
 * (This is additional validation beyond Zod)
 */
export function isPasswordStrong(password: string): {
  isStrong: boolean
  score: number
  feedback: string[]
} {
  const feedback: string[] = []
  let score = 0

  // Length check
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  
  // Character variety checks
  if (/[a-z]/.test(password)) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  // Feedback
  if (password.length < 8) feedback.push('Use at least 8 characters')
  if (!/[a-z]/.test(password)) feedback.push('Add lowercase letters')
  if (!/[A-Z]/.test(password)) feedback.push('Add uppercase letters')
  if (!/[0-9]/.test(password)) feedback.push('Add numbers')
  if (!/[^A-Za-z0-9]/.test(password)) feedback.push('Add special characters')

  return {
    isStrong: score >= 4,
    score,
    feedback,
  }
}