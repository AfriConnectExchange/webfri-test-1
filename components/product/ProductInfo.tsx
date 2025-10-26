"use client"
import React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Rating from '@mui/material/Rating'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'
import Avatar from '@mui/material/Avatar'
import VerifiedIcon from '@mui/icons-material/Verified'
import TextField from '@mui/material/TextField'

type Product = {
  id: string
  title: string
  price: number
  rating?: { average: number; count: number }
  highlights?: string[]
  seller?: { name: string; avatar?: string; verified?: boolean }
}

export default function ProductInfo({ product }: { product: Product }) {
  const [qty, setQty] = React.useState(1)

  const handleAdd = () => {
    console.log('add to cart', product.id, qty)
  }

  const handleBuy = () => {
    console.log('buy now', product.id, qty)
  }

  return (
    <Card elevation={1} sx={{ borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>{product.title}</Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1, flexWrap: 'wrap' }}>
          <Typography sx={{ fontSize: 22, fontWeight: 800, color: 'primary.main' }}>£{product.price.toFixed(2)}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Rating value={product.rating?.average ?? 0} precision={0.1} readOnly size="small" />
            <Typography variant="caption" color="text.secondary">{(product.rating?.average ?? 0).toFixed(1)} ({product.rating?.count ?? 0})</Typography>
          </Box>
        </Box>

        {(product.highlights || []).length > 0 && (
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
            {(product.highlights || []).map((h: string) => (
              <Chip key={h} label={h} size="small" variant="outlined" />
            ))}
          </Box>
        )}

        {product.seller && (
          <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar src={product.seller.avatar ?? undefined} sx={{ width: 32, height: 32 }} />
            <Typography variant="body2" sx={{ fontWeight: 700 }}>{product.seller.name}</Typography>
            {product.seller.verified && <VerifiedIcon color="primary" fontSize="small" sx={{ ml: 0.5 }} />}
          </Box>
        )}
      </CardContent>

      <CardActions sx={{ px: 2, pb: 2, pt: 0, display: 'flex', gap: 1, alignItems: 'center' }}>
        <TextField
          type="number"
          size="small"
          value={qty}
          onChange={(e) => setQty(Math.max(1, Number(e.target.value || 1)))}
          sx={{ width: 100 }}
          inputProps={{ min: 1 }}
        />

        <Button variant="contained" startIcon={<AddShoppingCartIcon />} onClick={handleAdd}>
          Add to cart
        </Button>

        <Button variant="outlined" onClick={handleBuy}>Buy now</Button>

        <Button variant="text" sx={{ ml: 'auto' }}>Propose Offer</Button>
      </CardActions>
    </Card>
  )
}
