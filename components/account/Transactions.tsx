"use client"
import React from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

export default function Transactions(): React.ReactElement {
  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>Transactions</Typography>
      <Card sx={{ boxShadow: '0 6px 20px rgba(2,6,23,0.06)', borderRadius: 1 }}>
        <CardContent>
          <Typography color="text.secondary">No transactions yet. This area will list past payments and refunds.</Typography>
        </CardContent>
      </Card>
    </Box>
  )
}
