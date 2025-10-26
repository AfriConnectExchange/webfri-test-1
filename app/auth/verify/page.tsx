"use client"
import React from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import OtpVerify from '../../../components/auth/OtpVerify'

export default function VerifyPage() {
  const params = useSearchParams()
  const router = useRouter()
  const contact = params.get('contact') || undefined

  const handleVerify = async (code: string) => {
    // TODO: replace with real API verification call
    await new Promise((r) => setTimeout(r, 800))
    // simulate success for code '123456'
    const ok = code === '123456' || code.length >= 4
    if (ok) {
      router.push('/postauth')
    }
    return ok
  }

  const handleResend = async () => {
    // TODO: call backend to resend code
    await new Promise((r) => setTimeout(r, 600))
  }

  return (
    <Box className="min-h-screen flex items-center justify-center p-6">
      <Card sx={{ maxWidth: 540, width: '100%', boxShadow: '0 10px 36px rgba(15,23,42,0.08)' }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" sx={{ mb: 1.5, fontWeight: 700 }}>Verify Account</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Enter the verification code we sent to {contact ?? 'your email/phone'}</Typography>

          <OtpVerify contactLabel={contact} onVerify={handleVerify} onResend={handleResend} />
        </CardContent>
      </Card>
    </Box>
  )
}
