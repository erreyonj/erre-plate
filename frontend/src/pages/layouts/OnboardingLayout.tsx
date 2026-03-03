import { AppBar, Box, Toolbar, Typography, Link } from '@mui/material'
import { Outlet, Link as RouterLink } from 'react-router-dom'
import { useTheme } from '@mui/material/styles'

export default function OnboardingLayout() {
  const theme = useTheme()
  const mode = theme.palette.mode

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: theme.palette.background.default,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <AppBar
        position="static"
        elevation={0}
        sx={{
          bgcolor: 'transparent',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <Toolbar
          sx={{
            minHeight: 64,
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <img
            src={
              mode === 'light'
                ? '/errePlate.iconography.landscape3 /logo-black.png'
                : '/errePlate.iconography.landscape3 /logo-gray.png'
            }
            alt="errePlate Logo"
            className="w-36"
          />

          <Link
            component={RouterLink}
            to="/login"
            underline="hover"
            sx={{ fontWeight: 600 }}
          >
            Back to Login
          </Link>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 2,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  )
}