import { prisma } from '@/lib/prisma/client'
import { sendEmail } from './client'
import { ReactElement } from 'react'

// Email data interfaces
export interface VerificationEmailData {
  username: string
  verificationUrl: string
}

export interface WelcomeEmailData {
  username: string
}

export interface PasswordResetEmailData {
  username: string
  resetUrl: string
}

export interface OTPEmailData {
  username: string
  code: string
}

export type EmailData = 
  | ({ type: 'verification' } & VerificationEmailData)
  | ({ type: 'welcome' } & WelcomeEmailData)
  | ({ type: 'password-reset' } & PasswordResetEmailData)
  | ({ type: 'otp' } & OTPEmailData)

interface SendEmailOptions {
  to: string
  subject: string
  component: ReactElement
  userId?: string
  metadata?: EmailData
  retryCount?: number
}

// Maximum number of retry attempts
const MAX_RETRIES = 3

// Delay between retries (in milliseconds)
const RETRY_DELAYS = [1000, 5000, 15000] // 1s, 5s, 15s

/**
 * Send an email with retry logic and logging
 */
export async function sendEmailWithRetry(options: SendEmailOptions): Promise<boolean> {
  const { to, subject, component, userId, metadata, retryCount = 0 } = options

  try {
    // Create email log entry
    const emailLog = await prisma.emailLog.create({
      data: {
        to,
        subject,
        userId,
        metadata: metadata || {},
        status: 'pending',
        attempts: retryCount,
      },
    })

    // Try to send the email
    const success = await sendEmail({
      to,
      subject,
      component,
    })

    if (success) {
      // Update email log on success
      await prisma.emailLog.update({
        where: { id: emailLog.id },
        data: {
          status: 'sent',
          sentAt: new Date(),
        },
      })
      return true
    }

    // Handle failure
    if (retryCount < MAX_RETRIES) {
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAYS[retryCount]))

      // Retry with incremented count
      return sendEmailWithRetry({
        ...options,
        retryCount: retryCount + 1,
      })
    }

    // Update email log on final failure
    await prisma.emailLog.update({
      where: { id: emailLog.id },
      data: {
        status: 'failed',
        error: 'Max retry attempts exceeded',
      },
    })

    return false
  } catch (error) {
    // Log unexpected errors
    console.error('Email sending error:', error)
    return false
  }
}

// Email types
export type EmailType = 'verification' | 'welcome' | 'password-reset' | 'otp'

/**
 * Send an email by type with proper template
 */
export async function sendTemplatedEmail(
  type: EmailType,
  to: string,
  data: EmailData,
  userId?: string
): Promise<boolean> {
  const templates: Record<EmailType, {
    subject: string,
    getComponent: (data: EmailData) => Promise<ReactElement>
  }> = {
    verification: {
      subject: 'Verify your email address',
      getComponent: async (data) => {
        if (data.type !== 'verification') throw new Error('Invalid data type')
        const { VerificationEmail } = await import('./templates/verification-email')
        return VerificationEmail({
          username: data.username,
          verificationUrl: data.verificationUrl,
        })
      },
    },
    welcome: {
      subject: 'Welcome to AfriConnect Exchange',
      getComponent: async (data) => {
        if (data.type !== 'welcome') throw new Error('Invalid data type')
        const { default: WelcomeEmail } = await import('./templates/welcome-email')
        return WelcomeEmail({
          userName: data.username,
          dashboardLink: process.env.NEXT_PUBLIC_APP_URL + '/dashboard',
        })
      },
    },
    'password-reset': {
      subject: 'Reset your password',
      getComponent: async (data) => {
        if (data.type !== 'password-reset') throw new Error('Invalid data type')
        const { default: PasswordResetEmail } = await import('./templates/password-reset')
        return PasswordResetEmail({
          userName: data.username,
          resetLink: data.resetUrl,
        })
      },
    },
    otp: {
      subject: 'Your verification code',
      getComponent: async (data) => {
        if (data.type !== 'otp') throw new Error('Invalid data type')
        const { default: OTPEmail } = await import('./templates/otp-email')
        return OTPEmail({
          userName: data.username,
          otp: data.code,
        })
      },
    },
  }

  const template = templates[data.type]
  const component = await template.getComponent(data)

  return sendEmailWithRetry({
    to,
    subject: template.subject,
    component,
    userId,
    metadata: data,
  })
}

/**
 * Resend a failed email
 */
export async function resendFailedEmail(emailLogId: string): Promise<boolean> {
  const emailLog = await prisma.emailLog.findUnique({
    where: { id: emailLogId },
  })

  if (!emailLog || emailLog.status !== 'failed') {
    return false
  }

  // Re-run the original email sending attempt
  if (emailLog.metadata?.type && typeof emailLog.metadata.type === 'string') {
    const type = emailLog.metadata.type as EmailType
    return sendTemplatedEmail(
      type,
      emailLog.to,
      emailLog.metadata,
      emailLog.userId || undefined
    )
  }

  return false
}