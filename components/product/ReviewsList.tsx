"use client"
import React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Rating from '@mui/material/Rating'
import Divider from '@mui/material/Divider'

export default function ReviewsList({ reviews }: { reviews: { id: string; author: string; rating: number; title: string; body: string; createdAt: string }[] }) {
  if (!reviews || reviews.length === 0) return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6">Reviews</Typography>
        <Typography color="text.secondary">No reviews yet.</Typography>
      </CardContent>
    </Card>
  )

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" sx={{ mb: 1 }}>Reviews</Typography>
        {reviews.slice(0, 3).map((r) => (
          <Box key={r.id} sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Rating value={r.rating} readOnly size="small" />
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{r.title}</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>{r.author} • {r.createdAt}</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{r.body}</Typography>
            <Divider sx={{ mt: 1 }} />
          </Box>
        ))}
      </CardContent>
    </Card>
  )
}
