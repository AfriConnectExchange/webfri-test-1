import crypto from 'crypto'
import { headers } from 'next/headers'
import UAParser from 'ua-parser-js'
import { DeviceInfo } from '@/types/auth'

/**
 * Extract device information from request headers
 */
export async function getDeviceInfo(): Promise<DeviceInfo> {
  const headersList = await headers()
  const userAgent = headersList.get('user-agent') || ''
  const ipAddress = 
    headersList.get('x-forwarded-for')?.split(',')[0] ||
    headersList.get('x-real-ip') ||
    'unknown'

  const parser = new UAParser(userAgent)
  const result = parser.getResult()

  return {
    deviceType: result.device.type || 'desktop',
    deviceName: result.device.model || 'Unknown Device',
    browser: result.browser.name || 'Unknown',
    os: result.os.name || 'Unknown',
    ipAddress,
    userAgent,
  }
}

/**
 * Generate a unique device ID based on user agent and IP
 */
export function generateDeviceId(userAgent: string, ipAddress: string): string {
  const data = `${userAgent}-${ipAddress}`
  return crypto.createHash('sha256').update(data).digest('hex')
}

/**
 * Get location data from IP (placeholder - you can integrate with IP geolocation API)
 */
export async function getLocationFromIP(ipAddress: string): Promise<{
  city?: string
  country?: string
  latitude?: number
  longitude?: number
} | null> {
  // TODO: Integrate with IP geolocation service (ipapi.co, ipstack, etc.)
  // For now, return null
  return null
}