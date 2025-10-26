"use client"
import React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import LogoutIcon from '@mui/icons-material/Logout'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'
import PaymentIcon from '@mui/icons-material/Payment'
import VerifiedIcon from '@mui/icons-material/Verified'
import UpgradeIcon from '@mui/icons-material/ArrowUpward'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'

export type AccountSidebarKey =
  | 'my-account'
  | 'orders'
  | 'transactions'
  | 'verify-identity'
  | 'upgrade-account'
  | 'delete-account'

interface Props {
  selected?: AccountSidebarKey
  onSelect?: (key: AccountSidebarKey) => void
  onLogout?: () => void
}

const items: { key: AccountSidebarKey; label: string; icon: React.ReactElement }[] = [
  { key: 'my-account', label: 'My Account', icon: <AccountCircleIcon /> },
  { key: 'orders', label: 'Orders', icon: <ShoppingBagIcon /> },
  { key: 'transactions', label: 'Transactions', icon: <PaymentIcon /> },
  { key: 'verify-identity', label: 'Verify Identity', icon: <VerifiedIcon /> },
  { key: 'upgrade-account', label: 'Upgrade Account', icon: <UpgradeIcon /> },
  { key: 'delete-account', label: 'Delete Account', icon: <DeleteForeverIcon /> },
]

export default function AccountSidebar({ selected = 'my-account', onSelect, onLogout }: Props): React.ReactElement {
  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        boxShadow: '0 10px 36px rgba(15, 23, 42, 0.12)',
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      <CardContent sx={{ py: 2, px: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>My Account</Typography>
        <Typography variant="caption" color="text.secondary">Manage your profile and settings</Typography>
      </CardContent>

      <Box sx={{ flex: 1, px: 1 }}>
        <List disablePadding>
          {items.map((item) => (
            <ListItem key={item.key} disablePadding>
              <ListItemButton
                selected={selected === item.key}
                onClick={() => onSelect?.(item.key)}
                sx={{
                  py: 1.25,
                  px: 2,
                  borderLeft: selected === item.key ? '4px solid' : '4px solid transparent',
                  borderColor: selected === item.key ? 'primary.main' : 'transparent',
                  bgcolor: selected === item.key ? 'action.selected' : 'transparent',
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: 'text.primary' }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 600 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      <CardActions sx={{ p: 1 }}>
        <Button
          variant="text"
          color="inherit"
          fullWidth
          startIcon={<LogoutIcon />}
          sx={{ textTransform: 'none' }}
          onClick={() => {
            if (onLogout) onLogout()
            else console.log('logout')
          }}
        >
          Logout
        </Button>
      </CardActions>
    </Card>
  )
}
