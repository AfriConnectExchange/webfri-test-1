import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import ProductCard from '../ProductCard'

type RelatedItem = {
  id: string
  title?: string
  price?: number
  category?: string
  tags?: string[]
  location?: string
  rating?: number | { average: number; count: number }
  sellerName?: string
  sellerAvatar?: string
  sellerVerified?: boolean
}

export default function RelatedProducts({ items }: { items: RelatedItem[] }) {
  if (!items || items.length === 0) return null

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Related products</Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2 }}>
        {items.map((p) => (
          <Box key={p.id}>
            <ProductCard
              title={p.title ?? ''}
              price={p.price ?? 0}
              category={p.category}
              tags={p.tags}
              location={p.location}
              rating={typeof p.rating === 'number' ? p.rating : (p.rating?.average ?? 0)}
              sellerName={p.sellerName}
              sellerAvatar={p.sellerAvatar}
              sellerVerified={p.sellerVerified}
            />
          </Box>
        ))}
      </Box>
    </Box>
  )
}
