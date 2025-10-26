"use client"
import React from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

type Props = {
  children: React.ReactNode
}

export default function ClientThemeProvider({ children }: Props) {
  const theme = React.useMemo(() => createTheme({
    palette: {
      primary: { main: '#E11D48' },
      mode: 'light',
    },
    components: {
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8,
          },
        },
      },
    },
  }), [])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}
