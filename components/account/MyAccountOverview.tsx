"use client"
import React, { useState, useRef } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
// Stack no longer used after the layout update
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import Divider from '@mui/material/Divider'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import VerifiedIcon from '@mui/icons-material/Verified'

export default function MyAccountOverview(): React.ReactElement {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState('Adesope Muiz')
  const [email, setEmail] = useState('muizadesope83@gmail.com')
  const [phone, setPhone] = useState('+234 8179154249')
  const [address, setAddress] = useState('No 1 oluyemi street, Akinola, aboru')
  const [role, setRole] = useState<'buyer' | 'seller' | 'business'>('buyer')
  const [verified] = useState(true)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setAvatarUrl(url)
    }
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>Account Overview</Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 3,
          p: { xs: 2, md: 3 },
          borderRadius: 2,
          alignItems: 'stretch',
        }}
      >
        {/* Left profile column */}
        <Box sx={{ width: { xs: '100%', md: '34%' }, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', gap: 1 }}>
          <Box sx={{ position: 'relative', width: '100%' }}>
            <Avatar src={avatarUrl ?? undefined} sx={{ width: 96, height: 96, mx: 'auto', mb: 2 }} />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <IconButton aria-label="upload avatar" onClick={() => fileInputRef.current?.click()} sx={{ position: 'absolute', right: 16, top: 8 }} size="small">
              <PhotoCameraIcon fontSize="small" />
            </IconButton>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>{name}</Typography>
            {verified && <VerifiedIcon color="primary" fontSize="small" sx={{ ml: 0.5 }} />}
          </Box>

          {/* contact info is shown in the right-hand Profile Details to avoid duplication */}

          {/* left column shows static meta only; editing happens in the right column */}
          <Box sx={{ width: '100%', mt: 'auto' }} />
  </Box>

        {/* Right detail column (rearranged professional layout) */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 1 }}>
            {/* Header row with title and edit/save action */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Profile Details</Typography>
              <Button
                size="small"
                variant={editing ? 'contained' : 'outlined'}
                onClick={() => setEditing((s) => !s)}
              >
                {editing ? 'Save' : 'Edit'}
              </Button>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Key / value grid for details */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '160px 1fr' }, gap: 2, alignItems: 'start' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary' }}>Full name</Typography>
            {editing ? (
              <TextField size="small" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
            ) : (
              <Typography>{name}</Typography>
            )}

            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary' }}>Email</Typography>
            {editing ? (
              <TextField size="small" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
            ) : (
              <Typography>{email}</Typography>
            )}

            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary' }}>Phone</Typography>
            {editing ? (
              <TextField size="small" value={phone} onChange={(e) => setPhone(e.target.value)} fullWidth />
            ) : (
              <Typography>{phone}</Typography>
            )}

            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary' }}>Role</Typography>
            {editing ? (
              <FormControl size="small" fullWidth>
                <Select value={role} onChange={(e) => setRole(e.target.value as 'buyer' | 'seller' | 'business')}>
                  <MenuItem value="buyer">Buyer</MenuItem>
                  <MenuItem value="seller">Seller</MenuItem>
                  <MenuItem value="business">Business</MenuItem>
                </Select>
              </FormControl>
            ) : (
              <Typography sx={{ textTransform: 'capitalize' }}>{role}</Typography>
            )}

            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary' }}>Address</Typography>
            {editing ? (
              <TextField size="small" multiline minRows={3} value={address} onChange={(e) => setAddress(e.target.value)} fullWidth />
            ) : (
              <Typography variant="body2" color="text.secondary">{address}</Typography>
            )}
          </Box>

          {/* Optional actions or meta area */}
          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
            <Button size="small" color="inherit">View Activity</Button>
            <Button size="small" color="inherit">Security Settings</Button>
          </Box>
        </Paper>
        </Box>
  </Box>
    </Box>
  )
}
