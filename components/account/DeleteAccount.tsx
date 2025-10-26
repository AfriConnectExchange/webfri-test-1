"use client"
import React from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

export default function DeleteAccount(): React.ReactElement {
  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>Delete Account</Typography>
      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography color="text.secondary" sx={{ mb: 2 }}>Close your account permanently. This action cannot be undone.</Typography>
        <Button variant="contained" color="error">Delete Account</Button>
      </Paper>
    </Box>
  )
}
