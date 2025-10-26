import twilio from 'twilio'
import { logger } from '@/lib/security/logger'

// Initialize Twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER

if (!accountSid || !authToken || !twilioPhoneNumber) {
  console.warn('⚠️ Twilio credentials not configured. SMS functionality will be disabled.')
}

const client = accountSid && authToken ? twilio(accountSid, authToken) : null

export interface SendSMSOptions {
  to: string
  message: string
}

/**
 * Send SMS via Twilio
 */
export async function sendSMS(options: SendSMSOptions): Promise<boolean> {
  if (!client || !twilioPhoneNumber) {
    logger.error('sms', 'Twilio client not configured', undefined, {
      to: options.to,
    })
    return false
  }

  try {
    const message = await client.messages.create({
      body: options.message,
      from: twilioPhoneNumber,
      to: options.to,
    })

    logger.info('sms', `SMS sent successfully to ${options.to}`, {
      messageSid: message.sid,
      status: message.status,
    })

    return true
  } catch (error) {
    logger.error('sms', `Failed to send SMS to ${options.to}`, error as Error, {
      errorCode: (error as any).code,
      errorMessage: (error as any).message,
    })
    return false
  }
}

/**
 * Check SMS delivery status
 */
export async function checkSMSStatus(messageSid: string): Promise<string | null> {
  if (!client) {
    return null
  }

  try {
    const message = await client.messages(messageSid).fetch()
    return message.status
  } catch (error) {
    logger.error('sms', `Failed to check SMS status for ${messageSid}`, error as Error)
    return null
  }
}

export default client