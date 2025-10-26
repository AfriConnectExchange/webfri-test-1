import { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma/client'
import { verifyToken, isTokenExpired } from '@/lib/auth/tokens'
import { createSession, setSessionCookie } from '@/lib/auth/session'
import { getDeviceInfo } from '@/lib/security/device-fingerprint'
import { sendEmailWithLogging } from '@/lib/email/send'
import WelcomeEmail from '@/lib/email/templates/welcome-email'
import { logger } from '@/lib/security/logger'
import { logActivity } from '@/lib/security/logger'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.redirect(
        new URL('/auth/signin?error=invalid_token', request.url)
      )
    }

    // Find verification token
    const verificationRecord = await prisma.verificationToken.findFirst({
      where: { token },
    })

    if (!verificationRecord) {
      return NextResponse.redirect(
        new URL('/auth/signin?error=invalid_token', request.url)
      )
    }

    // Check if token has expired
    if (isTokenExpired(verificationRecord.expires)) {
      await prisma.verificationToken.delete({
        where: { identifier_token: { identifier: verificationRecord.identifier, token } },
      })

      return NextResponse.redirect(
        new URL('/auth/signin?error=expired_token', request.url)
      )
    }

    // Find user by email
    const user = await prisma.user.findFirst({
      where: { email: verificationRecord.identifier },
    })

    if (!user) {
      return NextResponse.redirect(
        new URL('/auth/signin?error=user_not_found', request.url)
      )
    }

    // Update user as verified and active
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        status: 'active',
        verificationStatus: 'verified',
      },
    })

    // Delete used token
    await prisma.verificationToken.delete({
      where: { identifier_token: { identifier: verificationRecord.identifier, token } },
    })

    // Send welcome email
    await sendEmailWithLogging({
      to: user.email!,
      subject: 'Welcome to AfriConnect Exchange!',
      template: WelcomeEmail({
        userName: user.fullName || 'there',
        dashboardLink: `${process.env.NEXT_PUBLIC_APP_URL}/account`,
      }),
      userId: user.id,
      templateName: 'welcome-email',
    })

    // Log activity
    await logActivity(user.id, 'email_verified', 'user', user.id)

    logger.info('auth', `Email verified for user ${user.id}`)

    // Create session and auto-login
    const deviceInfo = await getDeviceInfo()
    const { sessionToken, expiresAt } = await createSession(user.id, deviceInfo)
    await setSessionCookie(sessionToken, expiresAt)

    // Redirect to success page
    return NextResponse.redirect(
      new URL('/postauth?verified=true', request.url)
    )
  } catch (error) {
    logger.error('auth', 'Email verification error', error as Error)
    return NextResponse.redirect(
      new URL('/auth/signin?error=verification_failed', request.url)
    )
  }
}