"use client"
import React from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Logo from '../../../components/Logo'
import ForgotPassword from '../../../components/auth/ForgotPassword'

export default function ForgotPage() {
  return (
    <Box className="min-h-screen flex items-center justify-center p-6">
      <Box sx={{ width: '100%', maxWidth: 540 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Logo />
        </Box>
        <Card sx={{ boxShadow: '0 10px 36px rgba(15,23,42,0.08)' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ mb: 1.5, fontWeight: 700 }}>Forgot password</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Enter your email to receive a password reset link.</Typography>
            <ForgotPassword />
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}
