import { User, UserRole, UserStatus, VerificationStatus } from '@prisma/client'

export interface SessionUser {
  id: string
  email: string
  fullName: string | null
  profilePictureUrl: string | null
  roles: UserRole[]
  status: UserStatus
  verificationStatus: VerificationStatus
  emailVerified: Date | null
  phoneVerified: boolean
}

export interface SessionData {
  user: SessionUser
  sessionId: string
  expiresAt: Date
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

export interface DeviceInfo {
  deviceType?: string
  deviceName?: string
  browser?: string
  os?: string
  ipAddress?: string
  userAgent?: string
}