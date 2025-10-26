import { render } from '@react-email/render'
import { prisma } from '@/lib/prisma/client'
import { sendEmail } from './client'
import { logger } from '@/lib/security/logger'

interface SendEmailWithLoggingOptions {
  to: string
  subject: string
  template: React.ReactElement
  userId?: string
  templateName?: string
  maxRetries?: number
}

/**
 * Send email with logging and retry mechanism
 */
export async function sendEmailWithLogging(
  options: SendEmailWithLoggingOptions
): Promise<boolean> {
  const {
    to,
    subject,
    template,
    userId,
    templateName,
    maxRetries = 3,
  } = options

  // Render React Email template to HTML
  const html = render(template)

  // Create email log entry
  const emailLog = await prisma.emailLog.create({
    data: {
      userId: userId || null,
      recipientEmail: to,
      subject,
      templateName: templateName || null,
      provider: 'nodemailer',
      status: 'pending',
    },
  })

  let attempt = 0
  let lastError: Error | null = null

  // Retry logic with exponential backoff
  while (attempt < maxRetries) {
    attempt++

    try {
      const success = await sendEmail({ to, subject, html })

      if (success) {
        // Update email log as sent
        await prisma.emailLog.update({
          where: { id: emailLog.id },
          data: {
            status: 'sent',
            sentAt: new Date(),
          },
        })

        logger.info('email', `Email sent successfully to ${to} on attempt ${attempt}`)
        return true
      }
    } catch (error) {
      lastError = error as Error
      logger.warning(
        'email',
        `Email send attempt ${attempt} failed for ${to}`,
        { error: lastError.message }
      )

      // Wait before retrying (exponential backoff: 1s, 2s, 4s)
      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, attempt - 1)))
      }
    }
  }

  // All retries failed
  await prisma.emailLog.update({
    where: { id: emailLog.id },
    data: {
      status: 'failed',
      failedAt: new Date(),
      failureReason: lastError?.message || 'Unknown error',
    },
  })

  logger.error(
    'email',
    `Failed to send email to ${to} after ${maxRetries} attempts`,
    lastError || undefined
  )

  return false
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

  // TODO: Re-render template and resend
  // This would require storing template data in the log
  logger.info('email', `Resending failed email ${emailLogId}`)
  
  return false
}