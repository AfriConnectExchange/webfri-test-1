import { prisma } from '@/lib/prisma/client'

type LogLevel = 'info' | 'warning' | 'error'

interface LogData {
  component: string
  message: string
  level?: LogLevel
  userId?: string
  sessionId?: string
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