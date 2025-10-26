import { z } from 'zod'

// Email validation
export const emailSchema = z.string().email('Invalid email address')

// Phone validation (international format)
export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format')

// Password validation (min 6 chars, at least 1 letter and 1 number)
export const passwordSchema = z
  .string()
  .min(6, 'Password must be at least 6 characters')
  .regex(/[A-Za-z]/, 'Password must contain at least one letter')
  .regex(/[0-9]/, 'Password must contain at least one number')

// Sign up schema (email)
export const signUpEmailSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  role: z.enum(['buyer', 'seller', 'sme', 'trainer']),
  agree: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

// Sign up schema (phone)
export const signUpPhoneSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  phone: phoneSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  role: z.enum(['buyer', 'seller', 'sme', 'trainer']),
  agree: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

// Sign in schema (email)
export const signInEmailSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
})

// Sign in schema (phone)
export const signInPhoneSchema = z.object({
  phone: phoneSchema,
  password: z.string().min(1, 'Password is required'),
})

// OTP verification schema
export const verifyOtpSchema = z.object({
  phone: phoneSchema,
  code: z.string().length(6, 'OTP must be 6 digits'),
})

// Forgot password schema
export const forgotPasswordSchema = z.object({
  email: emailSchema,
})

// Reset password schema
export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

// Helper function to validate and return errors
export function validateSchema<T>(schema: z.ZodSchema<T>, data: unknown) {
  const result = schema.safeParse(data)
  
  if (!result.success) {
    const errors: Record<string, string> = {}
    result.error.errors.forEach((err) => {
      const path = err.path.join('.')
      errors[path] = err.message
    })
    return { success: false, errors }
  }
  
  return { success: true, data: result.data }
}