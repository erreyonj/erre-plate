import { Outlet } from 'react-router-dom'
import { Box, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import MobileLayout from './MobileLayout'

function ChefDesktopLayout() {
  const theme = useTheme()

  return (
    <Box
      id="CHEF_DESKTOP_LAYOUT"
      sx={{
        minHeight: '100vh',
        bgcolor: theme.palette.background.default,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        component="header"
        sx={{
          height: 72,
          px: 4,
          display: 'flex',
          alignItems: 'center',
          borderBottom: '1px solid',
          borderColor: 'divider',
          fontWeight: 800,
          fontSize: 24,
          letterSpacing: 1,
          textTransform: 'lowercase',
        }}
      >
        airplate
      </Box>

      <Box
        id="CHEF_DESKTOP_CONTENT"
        sx={{
          flex: 1,
          px: 4,
          py: 3,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 1200 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}

export default function ChefLayout() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  return isMobile ? <MobileLayout role="chef" /> : <ChefDesktopLayout />
}

