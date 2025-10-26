"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import CardActionArea from '@mui/material/CardActionArea'
import IconButton from '@mui/material/IconButton'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Avatar from '@mui/material/Avatar'
import VerifiedIcon from '@mui/icons-material/Verified'
// Button removed — using CardActionArea and IconButton for actions
import Rating from '@mui/material/Rating'
import LocationOnIcon from '@mui/icons-material/LocationOn'
// Stack no longer used; using Box for chip layout

type Props = {
  id?: string
  title: string
  price: number
  category?: string
  tags?: string[]
  location?: string
  rating?: number
  sellerName?: string
  sellerAvatar?: string
  sellerVerified?: boolean
}

export default function ProductCard({ id, title, price, category, tags = [], location, rating = 0, sellerName, sellerAvatar, sellerVerified = false }: Props) {
  const router = useRouter()
  const [adding, setAdding] = React.useState(false)

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation()
    setAdding(true)
    // simple feedback animation, reset after 500ms
    window.setTimeout(() => setAdding(false), 500)
    // TODO: wire to cart store
  }

  const handleCardClick = () => {
    if (id) {
      router.push(`/product/${id}`)
      return
    }
    // fallback for products without id
    console.log('open product (no id)', title)
  }

  return (
      <Card
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
          transition: 'transform 200ms ease, box-shadow 200ms ease',
          '&:hover': { transform: 'translateY(-6px)', boxShadow: 6 },
        }}
        elevation={1}
      >
      {/* make the whole card clickable */}
      <CardActionArea onClick={handleCardClick}>
        {/* image / media area */}
        <Box sx={{ position: 'relative', height: 140, bgcolor: 'grey.100' }}>
        <Box sx={{ position: 'absolute', top: 8, left: 8 }}>
          <Chip label={category} size="small" color="primary" sx={{ fontWeight: 600 }} />
        </Box>

        {/* price badge removed from image area; price shown in card actions */}
        </Box>

        <CardContent sx={{ p: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
            {/* allow this flex item to shrink correctly and not overflow the sibling rating box */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', gap: 1, mb: 0.25, flexDirection: 'column', alignItems: 'flex-start' }}>
                <Typography variant="body1" sx={{ fontSize: 12, fontWeight: 700, lineHeight: 1.1 }}>{title}</Typography>

                {sellerName && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
                    <Avatar src={sellerAvatar ?? undefined} sx={{ width: 18, height: 18 }} />
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10, display: { xs: 'none', sm: 'inline' } }}>{sellerName}</Typography>
                    {sellerVerified && <VerifiedIcon color="primary" fontSize="inherit" sx={{ ml: 0.5, fontSize: 14 }} />}
                  </Box>
                )}
              </Box>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5, width: '100%' }}>
                {tags.slice(0, 3).map((t) => (
                  <Chip
                    key={t}
                    label={t}
                    size="small"
                    variant="outlined"
                    sx={{
                      fontSize: { xs: 9, sm: 10 },
                      height: { xs: 18, sm: 22 },
                      '& .MuiChip-label': { px: { xs: 0.5, sm: 1 } },
                    }}
                  />
                ))}
              </Box>
            </Box>

            {/* rating column: keep fixed width and don't let tags overlap it */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flex: '0 0 auto', ml: 0.5 }}>
              <Rating value={rating} readOnly size="small" precision={0.5} />
              <Typography variant="caption" sx={{ fontSize: 11 }}>{rating.toFixed(1)}</Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.75 }}>
            <LocationOnIcon fontSize="small" color="action" sx={{ fontSize: 16 }} />
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>{location}</Typography>
          </Box>
        </CardContent>
      </CardActionArea>

      <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ fontSize: 13, fontWeight: 700, color: 'primary.main' }}>£{price.toFixed(2)}</Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            aria-label="add to cart"
            onClick={handleAdd}
            sx={{
              width: { xs: 24, sm: 28 },
              height: { xs: 24, sm: 28 },
              borderRadius: '50%',
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              '&:hover': { bgcolor: 'primary.dark' },
              transform: adding ? 'scale(0.9)' : 'scale(1)',
              transition: 'transform 120ms ease',
              ml: 1,
            }}
          >
            <ShoppingCartIcon sx={{ fontSize: { xs: 14, sm: 16 } }} />
          </IconButton>
        </Box>
      </CardActions>
    </Card>
  )
}
