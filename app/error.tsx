"use client"
import React, { useEffect } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Logo from '../components/Logo'
import { useRouter } from 'next/navigation'

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter()

  useEffect(() => {
    // Log the error in development/remote logging
    console.error('Unhandled error in app:', error)
  }, [error])

  return (
    <Box className="min-h-screen flex items-center justify-center p-6">
      <Box sx={{ width: '100%', maxWidth: 720 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Logo />
        </Box>
        <Card sx={{ boxShadow: '0 10px 36px rgba(15,23,42,0.08)' }}>
          <CardContent sx={{ p: 6, textAlign: 'center' }}>
            <Typography variant="h4" component="h1" sx={{ mb: 2, fontWeight: 700 }}>Something went wrong</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              An unexpected error occurred. You can try again or go back to the home page.
            </Typography>

            {process.env.NODE_ENV === 'development' && (
              <Typography variant="caption" sx={{ display: 'block', whiteSpace: 'pre-wrap', textAlign: 'left', mb: 2 }}>
                {String(error?.message ?? 'No error message')}
              </Typography>
            )}

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button variant="contained" onClick={() => reset()}>Try again</Button>
              <Button variant="outlined" onClick={() => router.push('/')}>Go home</Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}
