import { useContext } from 'react'
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Switch,
  Typography,
  IconButton,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import ReviewsIcon from '@mui/icons-material/Reviews'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import LogoutIcon from '@mui/icons-material/Logout'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import CloseIcon from '@mui/icons-material/Close'
import type { ReactNode } from 'react'
import { ColorModeContext } from '../../../design/theme'
import { useAuth } from '../../contexts/AuthContext'

type Role = 'customer' | 'chef'

interface RoleMobileDrawerProps {
  role: Role
  open: boolean
  onClose: () => void
}

interface DrawerItem {
  key: string
  label: string
  icon: ReactNode
  to?: string
  action?: 'appearance' | 'logout'
}

interface DrawerSection {
  title: string
  items: DrawerItem[]
}

const drawerConfig: Record<Role, DrawerSection[]> = {
  customer: [
    {
      title: 'Account & Settings',
      items: [
        {
          key: 'account',
          label: 'Account',
          icon: <AccountCircleIcon />,
          to: '/customer/profile',
        },
        {
          key: 'payments',
          label: 'Payments',
          icon: <CreditCardIcon />,
          to: '/customer/profile?section=payments',
        },
        {
          key: 'appearance',
          label: 'Appearance',
          icon: <DarkModeIcon />,
          action: 'appearance',
        },
      ],
    },
    {
      title: 'Activity',
      items: [
        {
          key: 'favorites',
          label: 'Favorites',
          icon: <FavoriteBorderIcon />,
          to: '/customer/profile?section=favorites',
        },
        {
          key: 'reviews',
          label: 'Reviews',
          icon: <ReviewsIcon />,
          to: '/customer/profile?section=reviews',
        },
      ],
    },
    {
      title: 'System',
      items: [
        {
          key: 'help',
          label: 'Help',
          icon: <HelpOutlineIcon />,
          // Placeholder route for now
          to: '/customer/profile?section=help',
        },
        {
          key: 'logout',
          label: 'Logout',
          icon: <LogoutIcon />,
          action: 'logout',
        },
      ],
    },
  ],
  chef: [
    {
      title: 'Account & Settings',
      items: [
        {
          key: 'account',
          label: 'Account',
          icon: <AccountCircleIcon />,
          to: '/chef/profile',
        },
        {
          key: 'payouts',
          label: 'Payouts',
          icon: <AccountBalanceWalletIcon />,
          to: '/chef/profile?section=payouts',
        },
        {
          key: 'appearance',
          label: 'Appearance',
          icon: <DarkModeIcon />,
          action: 'appearance',
        },
      ],
    },
    {
      title: 'Activity',
      items: [
        {
          key: 'earnings',
          label: 'Earnings',
          icon: <AttachMoneyIcon />,
          to: '/chef/profile?section=earnings',
        },
        {
          key: 'availability',
          label: 'Availability',
          icon: <EventAvailableIcon />,
          to: '/chef/profile?section=availability',
        },
      ],
    },
    {
      title: 'System',
      items: [
        {
          key: 'help',
          label: 'Help',
          icon: <HelpOutlineIcon />,
          // Placeholder route for now
          to: '/chef/profile?section=help',
        },
        {
          key: 'logout',
          label: 'Logout',
          icon: <LogoutIcon />,
          action: 'logout',
        },
      ],
    },
  ],
}

export default function RoleMobileDrawer({ role, open, onClose }: RoleMobileDrawerProps) {
  const theme = useTheme()
  const navigate = useNavigate()
  const colorMode = useContext(ColorModeContext)
  const { logout } = useAuth()
  const isDark = theme.palette.mode === 'dark'

  const handleAppearanceToggle = () => {
    colorMode.toggleColorMode()
    onClose()
  }

  const handleLogout = async () => {
    await logout()
    onClose()
    navigate('/login')
  }

  const handleItemClick = (item: DrawerItem) => {
    if (item.action === 'appearance') {
      handleAppearanceToggle()
      return
    }

    if (item.action === 'logout') {
      void handleLogout()
      return
    }

    if (item.to) {
      navigate(item.to)
      onClose()
    }
  }

  const sections = drawerConfig[role]

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: '100%',
          maxWidth: 360,
          bgcolor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1.5,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box>
          <Typography
            variant="subtitle2"
            sx={{ textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700, fontSize: 12 }}
          >
            Menu
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
            {role === 'customer' ? 'Customer' : 'Chef'} account
          </Typography>
        </Box>

        <IconButton onClick={onClose} aria-label="Close menu">
          <CloseIcon />
        </IconButton>
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        {sections.map((section, idx) => (
          <Box key={section.title}>
            <List
              subheader={
                <Typography
                  component="div"
                  sx={{
                    px: 2,
                    pt: idx === 0 ? 2 : 1.5,
                    pb: 0.75,
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: 0.8,
                    color: theme.palette.text.secondary,
                  }}
                >
                  {section.title}
                </Typography>
              }
              sx={{ py: 0 }}
            >
              {section.items.map((item) => {
                const isAppearance = item.action === 'appearance'

                return (
                  <ListItemButton
                    key={item.key}
                    onClick={() => handleItemClick(item)}
                    component={item.to && !item.action ? RouterLink : 'button'}
                    to={item.to && !item.action ? item.to : undefined}
                    sx={{
                      py: 1,
                      '& .MuiListItemIcon-root': {
                        color: theme.palette.text.secondary,
                      },
                    }}
                  >
                    <ListItemIcon>{isAppearance && isDark ? <LightModeIcon /> : item.icon}</ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      secondary={
                        isAppearance ? (isDark ? 'Dark mode' : 'Light mode') : undefined
                      }
                      primaryTypographyProps={{ fontWeight: 500, fontSize: 14 }}
                      secondaryTypographyProps={{ fontSize: 11 }}
                    />
                    {isAppearance && (
                      <Switch
                        edge="end"
                        checked={isDark}
                        onChange={handleAppearanceToggle}
                        inputProps={{ 'aria-label': 'Toggle dark mode' }}
                      />
                    )}
                  </ListItemButton>
                )
              })}
            </List>

            {idx < sections.length - 1 && <Divider sx={{ my: 1.5 }} />}
          </Box>
        ))}
      </Box>
    </Drawer>
  )
}

