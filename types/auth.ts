import { UserRole, UserStatus, VerificationStatus } from '@prisma/client'
import { Session, User as AuthUser } from 'better-auth/types'

export interface SessionUser {
  id: string
  email: string
  fullName: string | null
  profilePictureUrl: string | null
  roles: UserRole[]
  status: UserStatus
  verificationStatus: VerificationStatus
  emailVerified: Date | null
  phoneVerified: boolean | null
}

export interface DeviceInfo {
}

export interface SessionData {
  id: string
  token: string
  userId: string
  user: SessionUser
  deviceInfo: DeviceInfo
  csrfToken: string
  expiresAt: Date
  createdAt: Date
}

export interface SignUpEmailRequest {
  fullName: string
  email: string
  password: string
  confirmPassword: string
  role: UserRole
  agree: boolean
}

export interface SignUpPhoneRequest {
  fullName: string
  phone: string
  password: string
  confirmPassword: string
  role: UserRole
  agree: boolean
}

export interface SignInEmailRequest {
  email: string
  password: string
}

export interface SignInPhoneRequest {
  phone: string
  password: string
}

export interface VerifyOtpRequest {
  phone: string
  code: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  password: string
  confirmPassword: string
}

// Unified DeviceInfo used across the app. Combines fields from previous
// definitions to avoid duplicate interface name collisions.
export interface DeviceInfo {
  // identifiers
  deviceId?: string
  deviceName?: string

  // network / UA
  ip?: string
  ipAddress?: string
  userAgent?: string

  // device metadata
  deviceType?: string
  browser?: string
  os?: string

  // timestamps
  lastLogin?: Date
}

// Extend Better Auth's types with our custom fields
export interface ExtendedUser extends AuthUser {
  phone?: string
  fullName?: string
  roles: string[]
}

export interface ExtendedSession extends Session {
  user: ExtendedUser
}