"use client"
import React, { useState } from 'react'
import Box from '@mui/material/Box'
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import Image from 'next/image'

type Img = { src: string; alt?: string }

export default function ProductGallery({ images }: { images: Img[] }) {
  const [idx, setIdx] = useState(0)

  if (!images || images.length === 0) {
    return (
      <Box sx={{ width: '100%', height: { xs: 260, md: 360 }, bgcolor: 'grey.100', borderRadius: 1 }} />
    )
  }

  return (
    <Box>
      <Box sx={{ width: '100%', height: { xs: 300, md: 420 }, bgcolor: 'grey.100', borderRadius: 1, overflow: 'hidden', position: 'relative' }}>
        <Image src={images[idx].src} alt={images[idx].alt ?? 'product image'} fill style={{ objectFit: 'contain' }} sizes="(max-width: 600px) 100vw, 50vw" />
      </Box>

      <Box sx={{ mt: 1 }}>
        <ImageList cols={images.length >= 4 ? 4 : images.length} gap={8} sx={{ overflow: 'auto' }}>
          {images.map((im, i) => (
            <ImageListItem key={im.src} onClick={() => setIdx(i)} sx={{ cursor: 'pointer', borderRadius: 1 }}>
              <Box sx={{ position: 'relative', width: 64, height: 64, borderRadius: 1, overflow: 'hidden', boxShadow: i === idx ? '0 6px 18px rgba(15,23,42,0.06)' : 'none' }}>
                <Image src={im.src} alt={im.alt ?? ''} fill style={{ objectFit: 'cover' }} sizes="64px" />
              </Box>
            </ImageListItem>
          ))}
        </ImageList>
      </Box>
    </Box>
  )
}
