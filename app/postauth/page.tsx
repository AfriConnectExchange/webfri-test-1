"use client"
import React from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { useRouter } from 'next/navigation'

export default function PostAuthPage() {
  const router = useRouter()
  return (
    <Box className="min-h-screen flex items-center justify-center p-6">
      <Card sx={{ maxWidth: 700, width: '100%', boxShadow: '0 12px 48px rgba(15,23,42,0.12)' }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" sx={{ mb: 1.5, fontWeight: 700 }}>Welcome back!</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>You are signed in. From here you can go to your account dashboard or continue shopping.</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="contained" onClick={() => router.push('/account')}>Go to Account</Button>
            <Button variant="outlined" onClick={() => router.push('/')}>Continue shopping</Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
