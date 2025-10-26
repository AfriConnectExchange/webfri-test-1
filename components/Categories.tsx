"use client"
import React from 'react'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
// Paper import removed; using Box/Card-like styling for 3D effect
import ViewModuleIcon from '@mui/icons-material/ViewModule'
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone'
import LaptopMacIcon from '@mui/icons-material/LaptopMac'
import WatchIcon from '@mui/icons-material/Watch'

import type { ReactElement } from 'react'

type Category = {
  id: string
  label: string
  icon?: ReactElement
}

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'all', label: 'All', icon: <ViewModuleIcon fontSize="small" /> },
  { id: 'phones', label: 'Phones', icon: <PhoneIphoneIcon fontSize="small" /> },
  { id: 'laptops', label: 'Laptops', icon: <LaptopMacIcon fontSize="small" /> },
  { id: 'wearables', label: 'Wearables', icon: <WatchIcon fontSize="small" /> },
]

type Props = {
  onChange?: (selected: string[]) => void
  initial?: string[]
}

export default function Categories({ onChange, initial = [] }: Props) {
  const [selected, setSelected] = React.useState<string[]>(initial)

  const toggle = (id: string) => {
    setSelected((prev) => {
      let next: string[]
      if (prev.includes(id)) next = prev.filter((p) => p !== id)
      else next = [...prev, id]
      onChange?.(next)
      return next
    })
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 700, color: 'primary.main' }}>Categories</Typography>
      {/* Simple list: remove separate 3D card wrapper — Filters will provide the outer card */}
      <List disablePadding>
        {DEFAULT_CATEGORIES.map((c) => {
          const isSelected = selected.includes(c.id)
          return (
            <ListItem key={c.id} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={isSelected}
                onClick={() => toggle(c.id)}
                sx={(theme) => ({
                  borderRadius: 1,
                  py: 0.75,
                  px: 2,
                  gap: 1,
                  alignItems: 'center',
                  // subtle background on selected, with a left accent instead of full-fill
                  backgroundColor: isSelected ? (theme.palette.action.selected || 'transparent') : 'transparent',
                  borderLeft: isSelected ? `4px solid ${theme.palette.primary.main}` : '4px solid transparent',
                  '&.Mui-selected .MuiListItemText-root': {
                    color: theme.palette.text.primary,
                  },
                  '&:hover': { backgroundColor: isSelected ? theme.palette.action.hover : theme.palette.action.hover },
                })}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <Box sx={{
                    width: 34,
                    height: 34,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '8px',
                    // make icon colored when selected but keep background transparent
                    color: isSelected ? 'primary.main' : 'inherit',
                  }}>
                    {c.icon}
                  </Box>
                </ListItemIcon>
                <ListItemText primary={c.label} primaryTypographyProps={{ fontSize: 13, fontWeight: isSelected ? 700 : 500 }} />
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>
    </Box>
  )
}
