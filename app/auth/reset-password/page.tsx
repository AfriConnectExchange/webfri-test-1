"use client"
import React from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Logo from '../../../components/Logo'
import ResetPassword from '../../../components/auth/ResetPassword'

export default function ResetPasswordPage() {
  return (
    <Box className="min-h-screen flex items-center justify-center p-6">
      <Box sx={{ width: '100%', maxWidth: 540 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Logo />
        </Box>
        <Card sx={{ boxShadow: '0 10px 36px rgba(15,23,42,0.08)' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ mb: 1.5, fontWeight: 700 }}>Reset password</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Enter a new password to reset your account password.</Typography>
            <ResetPassword />
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}
