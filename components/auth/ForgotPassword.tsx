"use client"
import React from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useSnackbar } from '../Ui/SnackbarProvider'
import { useRouter } from 'next/navigation'

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [sent, setSent] = React.useState(false)
  const snackbar = useSnackbar()
  const router = useRouter()

  const validateEmail = (v: string) => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|\".+\")@(([^<>()[\]\\.,;:\s@\"]+\.)+[^<>()[\]\\.,;:\s@\"]{2,})$/i
    return re.test(v)
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!email.trim()) return snackbar.show('Please enter your email', 'warning')
    if (!validateEmail(email)) return snackbar.show('Enter a valid email address', 'warning')
    setLoading(true)
    try {
      // TODO: call API to request password reset link
      await new Promise((r) => setTimeout(r, 800))
      setSent(true)
      snackbar.show('Password reset link sent to your email', 'info')
    } catch (err) {
      console.error(err)
      snackbar.show('Failed to send reset link', 'error')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h6">Check your email</Typography>
        <Typography variant="body2" color="text.secondary">We sent a password reset link to <strong>{email}</strong>. Follow the link to reset your password.</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="contained" onClick={() => router.push('/auth/signin')}>Back to sign in</Button>
          <Button variant="outlined" onClick={handleSubmit}>Resend email</Button>
        </Box>
      </Box>
    )
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
  <Typography variant="body2" color="text.secondary">Enter the email associated with your account and we&apos;ll send a link to reset your password.</Typography>
      <TextField label="Email address" value={email} onChange={(e) => setEmail(e.target.value)} size="small" />
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button type="submit" variant="contained" disabled={loading}>{loading ? 'Sending...' : 'Send reset link'}</Button>
        <Button variant="outlined" onClick={() => router.push('/auth/signin')}>Back to sign in</Button>
      </Box>
    </Box>
  )
}

export default ForgotPassword
