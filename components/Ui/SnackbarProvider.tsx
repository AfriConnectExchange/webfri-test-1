"use client"
import React, { createContext, useContext, useState, ReactNode } from 'react'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'

type SnackSeverity = 'success' | 'info' | 'warning' | 'error'

type SnackbarContextValue = {
  show: (message: string, severity?: SnackSeverity) => void
}

const SnackbarContext = createContext<SnackbarContextValue | undefined>(undefined)

export function useSnackbar() {
  const ctx = useContext(SnackbarContext)
  if (!ctx) throw new Error('useSnackbar must be used within SnackbarProvider')
  return ctx
}

export function SnackbarProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [severity, setSeverity] = useState<SnackSeverity>('info')

  const show = (msg: string, sev: SnackSeverity = 'info') => {
    setMessage(msg)
    setSeverity(sev)
    setOpen(true)
  }

  return (
    <SnackbarContext.Provider value={{ show }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setOpen(false)} severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  )
}
