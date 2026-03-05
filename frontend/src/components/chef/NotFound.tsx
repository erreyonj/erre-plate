// components/ui/NotFound.tsx

import { Box, Typography, Button } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import SoupKitchenIcon from '@mui/icons-material/SoupKitchen'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'

export default function NotFound() {
  const theme = useTheme()

  return (
    <Box
      sx={{
        height: '100%',
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 4,
        textAlign: 'center',
      }}
    >
      {/* Icon Container */}
      <Box
        sx={{
          position: 'relative',
          width: 120,
          height: 120,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Main Icon */}
        <SoupKitchenIcon
          sx={{
            fontSize: 64,
            color: theme.palette.text.primary,
            opacity: 0.9,
          }}
        />

        {/* Warning Overlay */}
        <WarningAmberIcon
          sx={{
            position: 'absolute',
            top: 18,
            right: 18,
            fontSize: 28,
            color: theme.palette.warning.main,
            backgroundColor: theme.palette.background.paper,
            borderRadius: '50%',
          }}
        />
      </Box>

      {/* Message */}
      <Typography
        variant="body2"
        sx={{
          maxWidth: 320,
          opacity: 0.75,
          letterSpacing: 0.5,
        }}
      >
        Hmm.. Don't think Chef is present. Were you thinking of inviting someone?
      </Typography>

      {/* CTA */}
      <Button
        variant="contained"
        sx={{
          borderRadius: 3,
          textTransform: 'none',
          px: 3,
        }}
      >
        Invite Chef
      </Button>
    </Box>
  )
}