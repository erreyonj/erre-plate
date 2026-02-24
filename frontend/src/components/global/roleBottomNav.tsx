import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import type { ReactNode } from 'react'
import { useTheme } from '@mui/material/styles'
import { Link as RouterLink } from 'react-router-dom'

type Role = 'customer' | 'chef'

interface NavItem {
  value: string
  icon: ReactNode
  to: string
}

const navConfig: Record<Role, NavItem[]> = {
  customer: [
    { value: 'home', icon: <HomeIcon />, to: '/customer/dashboard' },
    { value: 'orders', icon: <ReceiptLongIcon />, to: '/customer/orders' },
    { value: 'profile', icon: <PersonOutlineIcon />, to: '/customer/profile' },
  ],
  chef: [
    { value: 'dashboard', icon: <HomeIcon />, to: '/chef/dashboard' },
    { value: 'orders', icon: <ReceiptLongIcon />, to: '/chef/orders' },
    { value: 'profile', icon: <PersonOutlineIcon />, to: '/chef/profile' },
  ],
}

interface RoleBottomNavProps {
  role: Role
  value: string
  onChange: (value: string) => void
}

export default function RoleBottomNav({ role, value, onChange }: RoleBottomNavProps) {
  const theme = useTheme()

  return (
    <Paper
      elevation={6}
      sx={{
        position: 'fixed',
        left: 16,
        right: 16,
        bottom: 16,
        borderRadius: 999,
        bgcolor: theme.palette.primary.main,
        overflow: 'hidden',
      }}
    >
      <BottomNavigation
        value={value}
        onChange={(_, v) => onChange(v)}
        showLabels={false}
        sx={{
          height: 64,
          bgcolor: 'transparent',
          '& .MuiBottomNavigationAction-root': {
            minWidth: 0,
            color: 'rgba(255,255,255,0.9)',
          },
          '& .Mui-selected': {
            color: `${theme.palette.secondary.main} !important`,
          },
        }}
      >
        {navConfig[role].map((item) => (
          <BottomNavigationAction
            key={item.value}
            value={item.value}
            icon={item.icon}
            component={RouterLink}
            to={item.to}
          />
        ))}
      </BottomNavigation>
    </Paper>
  )
}

