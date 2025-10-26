/**
 * Better Auth Configuration
 * 
 * Note: We're using a custom session management system with Prisma
 * instead of Better Auth's built-in session handling because we need
 * more control over device tracking, security logging, etc.
 * 
 * This file is prepared for OAuth providers which we'll implement later.
 */

export const authConfig = {
  secret: process.env.BETTER_AUTH_SECRET || '',
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
  
  // We'll configure OAuth providers here later
  providers: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      redirectUri: `${process.env.BETTER_AUTH_URL}/api/auth/google/callback`,
    },
    facebook: {
      appId: process.env.FACEBOOK_APP_ID || '',
      appSecret: process.env.FACEBOOK_APP_SECRET || '',
      redirectUri: `${process.env.BETTER_AUTH_URL}/api/auth/facebook/callback`,
    },
  },
}

// Validate configuration
export function validateAuthConfig(): boolean {
  if (!authConfig.secret || authConfig.secret.length < 32) {
    console.error('❌ BETTER_AUTH_SECRET must be at least 32 characters')
    return false
  }

  if (!authConfig.baseURL) {
    console.error('❌ BETTER_AUTH_URL is required')
    return false
  }

  return true
}