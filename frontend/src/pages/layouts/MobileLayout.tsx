import { useState } from 'react'
import { AppBar, Box, Toolbar, Typography, IconButton } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import MenuIcon from '@mui/icons-material/Menu'
import { Outlet } from 'react-router-dom'
import RoleBottomNav from '../../components/global/roleBottomNav'
import RoleMobileDrawer from '../../components/global/roleMobileDrawer'
interface MobileLayoutProps {
  role?: 'customer' | 'chef'
}

export default function MobileLayout({ role = 'customer' }: MobileLayoutProps) {
  const theme = useTheme()
  const [nav, setNav] = useState<string>('home')
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  return (
    <Box id="MOBILE_LAYOUT" sx={{ minHeight: '100vh', width: '100%', bgcolor: theme.palette.background.default }}>
      <AppBar
        position="sticky"
        elevation={2}
        sx={{
          bgcolor: theme.palette.background.default,
          color: theme.palette.text.primary,
          borderBottom: '1px solid',
          borderColor: 'rgba(0,0,0,0.08)',
        }}
      >
        <Toolbar sx={{ minHeight: 64, display: 'flex', justifyContent: 'space-between' }}>
          <Typography
            component="div"
            sx={{
              fontWeight: 900,
              fontSize: 24,
              letterSpacing: 1,
              textTransform: 'lowercase',
              color: theme.palette.text.primary,
            }}
          >
            airplate
          </Typography>
          <IconButton
            aria-label="Open menu"
            edge="end"
            sx={{ color: theme.palette.text.primary }}
            onClick={() => setIsDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box id="PAGE_CONTENT" sx={{ px: 2, pt: 2, pb: 14 }}>
        <Outlet />
      </Box>

      <RoleBottomNav role={role} value={nav} onChange={setNav} />
      <RoleMobileDrawer role={role} open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </Box>
  )
}

