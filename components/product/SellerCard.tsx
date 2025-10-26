import React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import VerifiedIcon from '@mui/icons-material/Verified'

export default function SellerCard({ seller }: { seller: { name: string; avatar?: string; verified?: boolean; rating?: number; joinedYear?: number } }) {
  if (!seller) return null

  return (
    <Card variant="outlined" sx={{ borderRadius: 1 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar src={seller.avatar ?? undefined} sx={{ width: 56, height: 56 }} />
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{seller.name}</Typography>
              {seller.verified && <VerifiedIcon color="primary" fontSize="small" />}
            </Box>
            <Typography variant="caption" color="text.secondary">Joined {seller.joinedYear}</Typography>
            <Box sx={{ mt: 1 }}>
              <Button size="small" variant="outlined">Contact Seller</Button>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}
