"use client"
import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Slider from '@mui/material/Slider'
import Divider from '@mui/material/Divider'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import Categories from './Categories'

export default function Filters() {
  const [price, setPrice] = React.useState<number[]>([0, 1000])
  const [freeShipping, setFreeShipping] = React.useState(false)
  const [inStock, setInStock] = React.useState(true)
  const [selectedCats, setSelectedCats] = React.useState<string[]>([])

  const apply = () => {
    // For demo we just log; in a real app this would trigger a filter query
    console.log('apply filters', { price, freeShipping, inStock, selectedCats })
  }

  const clear = () => {
    setPrice([0, 1000])
    setFreeShipping(false)
    setInStock(true)
    setSelectedCats([])
  }

  return (
    // Outer 3D sidebar card (client component so theme functions in sx are safe)
    <Box sx={{ width: '100%', px: 2, py: 1 }}>
      <Box
        sx={{
          borderRadius: 3,
          p: { xs: 1, sm: 1.5 },
          // sticky on md+ screens
          position: { md: 'sticky' },
          top: { md: 88 },
          background: (theme) => theme.palette.mode === 'dark' ? 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))' : 'linear-gradient(180deg, #fff, #fbfbfb)',
          boxShadow: (theme) => theme.palette.mode === 'dark'
            ? '0 12px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.02)'
            : '0 18px 44px rgba(2,6,23,0.08), 0 4px 8px rgba(2,6,23,0.04)',
          border: (theme) => theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.03)' : '1px solid rgba(2,6,23,0.04)',
        }}
      >
        <Categories onChange={(v) => setSelectedCats(v)} initial={selectedCats} />

        <Divider sx={{ my: 1 }} />

        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 700, color: 'primary.main', fontSize: 14 }}>Price (£)</Typography>
          <Box sx={{ px: 1 }}>
            <Slider
              value={price}
              onChange={(_, v) => setPrice(v as number[])}
              valueLabelDisplay="auto"
              min={0}
              max={5000}
              sx={{ color: 'primary.main' }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="caption" sx={{ fontSize: 12 }}>£{price[0]}</Typography>
              <Typography variant="caption" sx={{ fontSize: 12 }}>£{price[1]}</Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 1 }} />

        <Box sx={{ p: 2 }}>
          <FormControlLabel
            control={<Checkbox checked={freeShipping} onChange={(e) => setFreeShipping(e.target.checked)} sx={{ color: 'primary.main', '&.Mui-checked': { color: 'primary.main' } }} />}
            label={<Typography sx={{ fontSize: 13 }}>Free shipping</Typography>}
          />
          <FormControlLabel
            control={<Checkbox checked={inStock} onChange={(e) => setInStock(e.target.checked)} sx={{ color: 'primary.main', '&.Mui-checked': { color: 'primary.main' } }} />}
            label={<Typography sx={{ fontSize: 13 }}>In stock</Typography>}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 1, px: 2, pb: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
          <Button variant="contained" size="small" onClick={apply} fullWidth sx={{ bgcolor: 'primary.main' }}>Apply</Button>
          <Button variant="outlined" size="small" onClick={clear} fullWidth sx={{ borderColor: 'primary.main', color: 'primary.main' }}>Clear</Button>
        </Box>
      </Box>
    </Box>
  )
}
