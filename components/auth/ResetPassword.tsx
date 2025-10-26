"use client"
import React from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useSnackbar } from '../Ui/SnackbarProvider'
import { useRouter } from 'next/navigation'

const ResetPassword: React.FC = () => {
  const [password, setPassword] = React.useState('')
  const [confirm, setConfirm] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const snackbar = useSnackbar()
  const router = useRouter()

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!password) return snackbar.show('Please enter a new password', 'warning')
    if (password.length < 6) return snackbar.show('Password must be at least 6 characters', 'warning')
    if (password !== confirm) return snackbar.show('Passwords do not match', 'warning')
    setLoading(true)
    try {
      // TODO: call API to set new password using token
      await new Promise((r) => setTimeout(r, 800))
      snackbar.show('Password reset successfully. You can now sign in.', 'success')
      router.push('/auth/signin')
    } catch (err) {
      console.error(err)
      snackbar.show('Failed to reset password', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="body2" color="text.secondary">Enter your new password</Typography>
      <TextField label="New password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} size="small" />
      <TextField label="Confirm password" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} size="small" />
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button type="submit" variant="contained" disabled={loading}>{loading ? 'Saving...' : 'Save new password'}</Button>
        <Button variant="outlined" onClick={() => router.push('/auth/signin')}>Back to sign in</Button>
      </Box>
    </Box>
  )
}

export default ResetPassword
