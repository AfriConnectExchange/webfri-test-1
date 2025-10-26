"use client"
import React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import SmartSearch from './SmartSearch'
import SearchIcon from '@mui/icons-material/Search'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import NotificationsIcon from '@mui/icons-material/Notifications'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Button from '@mui/material/Button'
import Badge from '@mui/material/Badge'
import Dialog from '@mui/material/Dialog'
// Popover removed (desktop search no longer opens a popover)
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
// (nav buttons removed) Button import no longer required
import MenuIcon from '@mui/icons-material/Menu'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import Logo from './Logo'

type HeaderProps = {
  // optional: allow parent to control drawer open state
  onOpen?: () => void
}

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Sign in', href: '/auth/signin' },
  { label: 'Sign up', href: '/auth/signup' },
]

const Header: React.FC<HeaderProps> = ({ onOpen }) => {
  const theme = useTheme()
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'))
  const [open, setOpen] = React.useState(false)

  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'))

  // account menu and search dialog state
  const [accountAnchor, setAccountAnchor] = React.useState<null | HTMLElement>(null)
  const [searchDialogOpen, setSearchDialogOpen] = React.useState(false)
  const toggleDrawer = (next: boolean) => () => {
    setOpen(next)
    if (next && onOpen) onOpen()
  }

  // TODO: wire to real auth state / context. For now false so header shows Sign in button.
  const isSignedIn = false

  // Dialog Paper styles: on small screens make the dialog sit in the header area (full-width, no radius)
  const dialogPaperSx = isSmall
    ? {
        position: 'absolute' as const,
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        borderRadius: 0,
        boxShadow: 'none',
        minHeight: { xs: 56, sm: 64 },
        display: 'flex',
        alignItems: 'center',
        p: { xs: 0.5, sm: 1 },
      }
    : {
        position: 'absolute' as const,
        top: { xs: '8px', sm: '12px', md: '64px' },
        left: '50%',
        transform: 'translateX(-50%)',
        width: { xs: 'min(92vw, 520px)', sm: 'min(92vw,560px)', md: 560 },
        maxWidth: '100%',
        borderRadius: { xs: 1, sm: 1.5, md: 2 },
        boxShadow: 6,
        minHeight: { xs: 84, sm: 96 },
        display: 'flex',
        alignItems: 'center',
        p: { xs: 1, sm: 1.5 },
        overflow: 'visible',
      }

  const drawerContent = (
    <Box sx={{ width: 260 }} role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
      <Box sx={{ p: 2 }}>
        <Logo />
      </Box>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.href} disablePadding>
            <ListItemButton component="a" href={item.href}>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )

  return (
    <AppBar
      position="sticky"
      color="transparent"
      elevation={0}
      sx={{
        py: { xs: 1, sm: 1 },
        // translucent background with blur so the header reads above content
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(6,6,6,0.6)' : 'rgba(255,255,255,0.85)'),
        backdropFilter: 'saturate(180%) blur(6px)',
        // soft shadow to lift the header from the page
        boxShadow: (theme) => theme.palette.mode === 'dark' ? '0 6px 20px rgba(0,0,0,0.6)' : '0 6px 20px rgba(2,6,23,0.08)',
        borderBottom: (theme) => theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.04)' : '1px solid rgba(0,0,0,0.06)',
        zIndex: (theme) => theme.zIndex.appBar,
      }}
    >
      {/* Container adds responsive horizontal padding so header content isn't flush to the viewport edges */}
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        {isSmall || isTablet ? (
          <Toolbar disableGutters sx={{ display: 'flex', alignItems: 'center', px: 0 }}>
            {/* Left area: holds the menu button on small screens. Fixed width so center can be truly centered */}
            <Box sx={{ width: 48, display: 'flex', alignItems: 'center' }}>
              {/* show menu on very small and tablet */}
              {(isSmall || isTablet) && (
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="open drawer"
                  onClick={toggleDrawer(true)}
                  sx={{ ml: 0, '&.Mui-focusVisible': { boxShadow: 'none' } }}
                >
                  <MenuIcon />
                </IconButton>
              )}
            </Box>

            {/* Center area: logo centered and smaller on tablet/mobile */}
            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Logo variant={isTablet || isSmall ? 'compact' : 'full'} />
            </Box>

            {/* Right area: icons for search, cart, notifications and account (mobile/tablet) */}
            <Box sx={{ width: 140, display: 'flex', justifyContent: 'flex-end', gap: 1, alignItems: 'center' }}>
              {/* Search icon opens dialog with SmartSearch */}
              <IconButton
                color="inherit"
                aria-label="open search"
                onClick={() => setSearchDialogOpen(true)}
              >
                <SearchIcon />
              </IconButton>

              {/* Cart */}
              <IconButton color="inherit" aria-label="open cart" component="a" href="/cart">
                <Badge badgeContent={2} color="error">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>

              {/* Notifications (mobile/tablet) */}
              <IconButton color="inherit" aria-label="notifications" sx={{ ml: 0 }}>
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>

              {/* Account menu trigger (mobile/tablet) */}
              <IconButton color="inherit" aria-label="account" onClick={(e) => setAccountAnchor(e.currentTarget)}>
                <AccountCircleIcon />
              </IconButton>
            </Box>

            {/* mobile drawer */}
            <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
              {drawerContent}
            </Drawer>
          </Toolbar>
        ) : (
          <Toolbar disableGutters sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 0 }}>
            {/* Desktop: logo and search on the left */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 6, pt: 0.25 }}>
              <Logo />
              {/* Group SmartSearch and the new Search button so the button sits close to the input */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {!isSmall && <SmartSearch />}
              </Box>

            </Box>

            {/* Desktop right area: only icons (no nav links) */}
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', ml: 2 }}>
                    {/* Desktop: inline SmartSearch is shown on the left; provide an explicit Search button that
                        opens the same Popover used on smaller breakpoints. */}

                  <IconButton color="inherit" aria-label="open cart" component="a" href="/cart">
                    <Badge badgeContent={2} color="error">
                      <ShoppingCartIcon />
                    </Badge>
                  </IconButton>

                  <IconButton color="inherit" aria-label="notifications">
                    <Badge badgeContent={3} color="error">
                      <NotificationsIcon />
                    </Badge>
                  </IconButton>

                  {/* Account control: show labeled button with caret when signed in, otherwise a Sign in button */}
                  {isSignedIn ? (
                    <Button
                      size="small"
                      startIcon={<AccountCircleIcon />}
                      endIcon={<ExpandMoreIcon />}
                      onClick={(e) => setAccountAnchor(e.currentTarget)}
                      sx={{ textTransform: 'none' }}
                    >
                      Account
                    </Button>
                  ) : (
                    <Button
                      size="large"
                      variant="contained"
                      color="primary"
                      component="a"
                      href="/auth/signin"
                      sx={{
                        height: 40,
                        px: 2.5,
                        textTransform: 'none',
                        fontSize: '0.95rem',
                        fontWeight: 700,
                        borderRadius: '10px',
                        boxShadow: 'none',
                        transition: 'background-color 160ms, color 160ms',
                        '&:hover': {
                          // change the text color on hover and give a subtle darker background
                          color: 'var(--accent)',
                          backgroundColor: (theme) => theme.palette.mode === 'dark' ? undefined : '#C3143A',
                          boxShadow: 'none',
                        },
                      }}
                    >
                      Sign in
                    </Button>
                  )}
                </Box>
              </Box>
          </Toolbar>
        )}
        {/* Account menu and search UI (shared between mobile & desktop) */}
        <Menu anchorEl={accountAnchor} open={Boolean(accountAnchor)} onClose={() => setAccountAnchor(null)}>
          <MenuItem component="a" href="/account">My profile</MenuItem>
          <MenuItem component="a" href="/orders">Orders</MenuItem>
          <MenuItem component="a" href="/auth/signin">Sign in</MenuItem>
        </Menu>

        {/* Hybrid: Dialog on small screens, Popover anchored to the search icon on larger screens */}
        <Dialog
          open={searchDialogOpen}
          onClose={() => setSearchDialogOpen(false)}
          fullWidth
          maxWidth={isSmall ? false : 'sm'}
          sx={{
            '& .MuiDialog-container': {
              paddingLeft: 0,
              paddingRight: 0,
              alignItems: 'flex-start', // place Paper at top
              justifyContent: 'center', // center horizontally
            },
          }}
          PaperProps={{ sx: dialogPaperSx }}
        >
          <Box sx={{ p: 0, width: '100%' }}>
              <SmartSearch />
            </Box>
        </Dialog>

        {/* Popover removed: desktop uses inline SmartSearch; small/tablet use Dialog */}

      </Container>
    </AppBar>
  )
}

export default Header
