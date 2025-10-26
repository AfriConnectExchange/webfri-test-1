"use client"
import React from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Logo from '../components/Logo'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function NotFoundPage() {
  const router = useRouter()

  return (
    <Box className="min-h-screen flex items-center justify-center p-6">
      <Box sx={{ width: '100%', maxWidth: 720 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Logo />
        </Box>
        <Card sx={{ boxShadow: '0 10px 36px rgba(15,23,42,0.08)' }}>
          <CardContent sx={{ p: 6, textAlign: 'center' }}>
            <Typography variant="h4" component="h1" sx={{ mb: 2, fontWeight: 700 }}>Page not found</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button variant="contained" onClick={() => router.push('/')}>Go home</Button>
              <Button component={Link} href="/auth/signin" variant="outlined">Sign in</Button>
            </Box>

            <Typography variant="caption" display="block" sx={{ mt: 3, color: 'text.secondary' }}>
              If you think this is a mistake, reach out to support.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}
