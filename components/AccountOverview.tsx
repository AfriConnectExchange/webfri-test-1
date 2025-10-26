"use client"
import React from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

export default function AccountOverview() {
  return (
    <Paper sx={{ p: 3, borderRadius: 2, boxShadow: (theme) => theme.shadows?.[2] || '0 4px 14px rgba(2,6,23,0.06)' }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Account Overview</Typography>

      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
        <Box sx={{ p: 2, minHeight: 140 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Account details</Typography>
          {/* empty for now */}
        </Box>

        <Box sx={{ p: 2, minHeight: 140 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Address book</Typography>
          {/* empty for now */}
        </Box>

        <Box sx={{ p: 2, minHeight: 140 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Store credit</Typography>
          {/* empty for now */}
        </Box>

        <Box sx={{ p: 2, minHeight: 140 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Newsletter preferences</Typography>
          {/* empty for now */}
        </Box>
      </Box>
    </Paper>
  )
}
