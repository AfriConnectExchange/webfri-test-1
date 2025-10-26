"use client"
import React, { useState } from 'react'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import AccountSidebar, { AccountSidebarKey } from '../../components/AccountSidebar'
import MyAccountOverview from '../../components/account/MyAccountOverview'
import Orders from '../../components/account/Orders'
import Transactions from '../../components/account/Transactions'
import VerifyIdentity from '../../components/account/VerifyIdentity'
import UpgradeAccount from '../../components/account/UpgradeAccount'
import DeleteAccount from '../../components/account/DeleteAccount'

export default function AccountPage(): React.ReactElement {
  const [selected, setSelected] = useState<AccountSidebarKey>('my-account')

  const renderContent = () => {
    switch (selected) {
      case 'my-account':
        return <MyAccountOverview />
      case 'orders':
        return <Orders />
      case 'transactions':
        return <Transactions />
      case 'verify-identity':
        return <VerifyIdentity />
      case 'upgrade-account':
        return <UpgradeAccount />
      case 'delete-account':
        return <DeleteAccount />
      default:
        return <MyAccountOverview />
    }
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 1.5, md: 3 } }}>
      <Box
        sx={{
          display: 'flex',
          gap: 3,
          alignItems: 'flex-start',
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        {/* Left navigation column */}
        <Box sx={{ width: { xs: '100%', md: 260 } }}>
          <AccountSidebar selected={selected} onSelect={(k) => setSelected(k)} onLogout={() => console.log('logout action')} />
        </Box>

        {/* Right content column (card wrapper for consistent design) */}
        <Box sx={{ flex: 1 }}>
          <Card sx={{ boxShadow: '0 10px 36px rgba(15,23,42,0.08)', borderRadius: 2 }}>
            <Box sx={{ p: { xs: 2, md: 3 } }}>{renderContent()}</Box>
          </Card>
        </Box>
      </Box>
    </Container>
  )
}
 
