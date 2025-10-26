"use client"
import React from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Link from '@mui/material/Link'
import Logo from '../../../components/Logo'
import { useSnackbar } from '../../../components/Ui/SnackbarProvider'
import { useRouter } from 'next/navigation'

export default function VerifiedEmailPage() {
  const snackbar = useSnackbar()
  const router = useRouter()

  const handleResend = async () => {
    // TODO: call API to resend verification email
    await new Promise((r) => setTimeout(r, 600))
    snackbar.show('Verification email resent', 'info')
  }

  return (
    <Box className="min-h-screen flex items-center justify-center p-6">
      <Box sx={{ width: '100%', maxWidth: 640 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Logo />
        </Box>
        <Card sx={{ boxShadow: '0 10px 36px rgba(15,23,42,0.08)' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ mb: 1.5, fontWeight: 700 }}>Check your email</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              We sent a verification link to your email. Please open your inbox and click the link to verify your account.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
              <Button variant="contained" onClick={() => router.push('/auth/signin')}>Back to sign in</Button>
              <Button variant="outlined" onClick={handleResend}>Resend email</Button>
            </Box>

            <Typography variant="body2" color="text.secondary">
              Didn&apos;t receive the email? Check your spam folder or {" "}
              <Link href="#" onClick={(e) => { e.preventDefault(); handleResend() }} underline="hover">try resending</Link>.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}
