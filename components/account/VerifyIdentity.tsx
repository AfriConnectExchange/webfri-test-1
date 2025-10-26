"use client"
import React from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

export default function VerifyIdentity(): React.ReactElement {
  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>Verify Identity</Typography>
      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography color="text.secondary" sx={{ mb: 2 }}>Verify your identity to unlock account features.</Typography>
        <Button variant="contained">Start verification</Button>
      </Paper>
    </Box>
  )
}
