import nodemailer, { TransportOptions } from 'nodemailer'
import { render } from '@react-email/render'
import { prisma } from '@/lib/prisma/client'
import { ReactElement } from 'react'

// Email configuration interface
interface EmailConfig {
  host: string | undefined
  port: number
  auth: {
    user: string | undefined
    pass: string | undefined
  }
  from: string | undefined
}

// Email options interface
interface EmailOptions {
  to: string
  subject: string
  component: ReactElement
  attachments?: Array<{
    filename: string
    content: string | Buffer
    contentType?: string
  }>
}
}

// Email configuration
const EMAIL_CONFIG = {
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  from: process.env.EMAIL_FROM,
}

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: EMAIL_CONFIG.host,
  port: EMAIL_CONFIG.port,
  secure: EMAIL_CONFIG.port === 465,
  auth: EMAIL_CONFIG.auth,
})

// Verify connection configuration
transporter
  .verify()
  .then(() => {
    logger.info('SMTP connection established successfully')
  })
  .catch((error) => {
    logger.error('SMTP connection error:', error)
  })

interface EmailOptions {
  to: string
  subject: string
  component: React.ReactElement
  attachments?: nodemailer.Attachment[]
}

/**
 * Send an email using nodemailer with React Email templates
 */
export async function sendEmail({
  to,
  subject,
  component,
  attachments,
}: EmailOptions): Promise<boolean> {
  try {
    // Render React component to HTML
    const html = render(component)

    // Send mail
    await transporter.sendMail({
      from: EMAIL_CONFIG.from,
      to,
      subject,
      html,
      attachments,
    })

    // Log success
    logger.info('Email sent successfully', {
      to,
      subject,
    })

    return true
  } catch (error) {
    // Log error
    logger.error('Failed to send email', {
      error: error as Error,
      to,
      subject,
    })

    return false
  }
}

/**
 * Verify SMTP configuration is working
 */
export async function verifyEmailConfig(): Promise<boolean> {
  try {
    await transporter.verify()
    return true
  } catch (error) {
    logger.error('Email configuration error:', error as Error)
    return false
  }
}
  metadata?: Record<string, any>
  errorCode?: string
  stackTrace?: string
}

/**
 * Log to system_logs table
 */
export async function log(data: LogData): Promise<void> {
  try {
    await prisma.systemLog.create({
      data: {
        logLevel: data.level || 'info',
        component: data.component,
        message: data.message,
        errorCode: data.errorCode || null,
        stackTrace: data.stackTrace || null,
        userId: data.userId || null,
        sessionId: data.sessionId || null,
        metadata: data.metadata || {},
      },
    })
  } catch (error) {
    // Fallback to console if DB logging fails
    console.error('Failed to log to database:', error)
    console.log('Original log:', data)
  }
}

/**
 * Log activity to activity_logs table
 */
export async function logActivity(
  userId: string,
  action: string,
  entityType?: string,
  entityId?: string,
  changes?: Record<string, any>,
  sessionId?: string,
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  try {
    await prisma.activityLog.create({
      data: {
        userId,
        sessionId: sessionId || null,
        action,
        entityType: entityType || null,
        entityId: entityId || null,
        changes: changes || null,
        ipAddress: ipAddress || null,
        userAgent: userAgent || null,
      },
    })
  } catch (error) {
    console.error('Failed to log activity:', error)
  }
}

/**
 * Convenience methods
 */
export const logger = {
  info: (component: string, message: string, metadata?: Record<string, any>) =>
    log({ component, message, level: 'info', metadata }),
  
  warning: (component: string, message: string, metadata?: Record<string, any>) =>
    log({ component, message, level: 'warning', metadata }),
  
  error: (
    component: string,
    message: string,
    error?: Error,
    metadata?: Record<string, any>
  ) =>
    log({
      component,
      message,
      level: 'error',
      errorCode: error?.name,
      stackTrace: error?.stack,
      metadata,
    }),
}