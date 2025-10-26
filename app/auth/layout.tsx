import React from 'react'
import ClientThemeProvider from '../../components/ClientThemeProvider'
import { SnackbarProvider } from '../../components/Ui/SnackbarProvider'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClientThemeProvider>
      <SnackbarProvider>
        {children}
      </SnackbarProvider>
    </ClientThemeProvider>
  )
}
