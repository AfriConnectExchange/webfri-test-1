"use client"
import React, { useEffect, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useSnackbar } from '../Ui/SnackbarProvider'

interface Props {
  contactLabel?: string
  onVerify: (code: string) => Promise<boolean> | boolean
  onResend?: () => Promise<void> | void
  length?: number
}

export default function OtpVerify({ contactLabel, onVerify, onResend, length = 6 }: Props) {
  const [values, setValues] = useState<string[]>(Array.from({ length }).map(() => ''))
  const inputsRef = useRef<Array<HTMLInputElement | null>>([])
  const [loading, setLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)
  const snackbar = useSnackbar()

  useEffect(() => {
    let t: number | undefined
    if (resendTimer > 0) t = window.setTimeout(() => setResendTimer((s) => s - 1), 1000)
    return () => {
      if (t) window.clearTimeout(t)
    }
  }, [resendTimer])

  const focusInput = (idx: number) => {
    const el = inputsRef.current[idx]
    if (el) el.focus()
  }

  const handleChange = (idx: number, v: string) => {
    if (!/^[0-9]*$/.test(v)) return
    const chars = v.split('')
    const next = [...values]
    // if user pastes multiple characters
    if (chars.length > 1) {
      for (let i = 0; i < chars.length && idx + i < length; i++) {
        next[idx + i] = chars[i]
      }
      setValues(next)
      const nextIndex = Math.min(length - 1, idx + chars.length)
      focusInput(nextIndex)
      return
    }

    next[idx] = v
    setValues(next)
    if (v && idx < length - 1) focusInput(idx + 1)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    const key = e.key
    if (key === 'Backspace') {
      if (values[idx]) {
        // clear current
        const next = [...values]
        next[idx] = ''
        setValues(next)
      } else if (idx > 0) {
        focusInput(idx - 1)
        const next = [...values]
        next[idx - 1] = ''
        setValues(next)
      }
    } else if (key === 'ArrowLeft' && idx > 0) {
      focusInput(idx - 1)
    } else if (key === 'ArrowRight' && idx < length - 1) {
      focusInput(idx + 1)
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const paste = e.clipboardData.getData('text').trim()
    if (!/^[0-9]+$/.test(paste)) return
    const chars = paste.split('').slice(0, length)
    const next = Array.from({ length }).map((_, i) => chars[i] ?? '')
    setValues(next)
    const lastFilled = Math.min(length - 1, chars.length - 1)
    focusInput(lastFilled)
  }

  const code = values.join('')

  const handleVerify = async () => {
    if (!code || code.length < Math.max(4, length)) return snackbar.show('Enter the verification code', 'warning')
    setLoading(true)
    try {
      const ok = await onVerify(code)
      if (ok) snackbar.show('Verified successfully', 'success')
      else snackbar.show('Verification failed', 'error')
      return ok
    } catch (err) {
      console.error(err)
      snackbar.show('Verification error', 'error')
      return false
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (onResend) {
      try {
        await onResend()
        snackbar.show('Verification code resent', 'info')
        setResendTimer(60)
      } catch (err) {
        console.error(err)
        snackbar.show('Failed to resend code', 'error')
      }
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="body2" color="text.secondary">Enter the {length}-digit verification code sent to {contactLabel ?? 'your contact'}</Typography>

      <Box sx={{ display: 'flex', gap: 1 }} onPaste={handlePaste}>
        {Array.from({ length }).map((_, i) => (
          <input
            key={i}
            ref={(el) => { inputsRef.current[i] = el }}
            value={values[i]}
            onChange={(e) => handleChange(i, e.target.value.replace(/[^0-9]/g, ''))}
            onKeyDown={(e) => handleKeyDown(e, i)}
            maxLength={1}
            inputMode="numeric"
            style={{
              width: 44,
              height: 44,
              textAlign: 'center',
              fontSize: 18,
              borderRadius: 8,
              border: '1px solid var(--mui-palette-divider, #e5e7eb)',
              outline: 'none',
            }}
          />
        ))}
      </Box>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button variant="contained" onClick={handleVerify} disabled={loading}>{loading ? 'Verifying...' : 'Verify'}</Button>
        <Button variant="outlined" onClick={handleResend} disabled={resendTimer > 0}>{resendTimer > 0 ? `Resend (${resendTimer}s)` : 'Resend code'}</Button>
      </Box>
    </Box>
  )
}
