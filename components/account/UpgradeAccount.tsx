"use client"
import React from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

export default function UpgradeAccount(): React.ReactElement {
  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>Upgrade Account</Typography>
      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography color="text.secondary" sx={{ mb: 2 }}>Upgrade to a seller or business account to access advanced features.</Typography>
        <Button variant="contained">Upgrade</Button>
      </Paper>
    </Box>
  )
}
