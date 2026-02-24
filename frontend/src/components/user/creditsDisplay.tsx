import { Box, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
// import { useAuth } from '../../contexts/AuthContext'

interface CreditsDisplayProps {
  credits?: number
}

export default function CreditsDisplay({ credits = 19 }: CreditsDisplayProps) {
  const theme = useTheme()
  // Get actual credits balance from user
  // const user = useAuth()

  return (
    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
      <Typography
        sx={{
          fontSize: 18,
          color: theme.palette.text.primary,
          textDecoration: 'underline',
          textUnderlineOffset: '6px',
        }}
      >
        My Credits:
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5 }}>
        <Box
          sx={{
            mt: 0.35,
            width: 18,
            height: 18,
            borderRadius: 999,
            bgcolor: theme.palette.success.main,
            color: '#fff',
            display: 'grid',
            placeItems: 'center',
            fontSize: 12,
            lineHeight: 1,
            fontWeight: 700,
          }}
        >
          $
        </Box>
        <Typography sx={{ fontSize: 34, fontWeight: 800, color: theme.palette.text.primary, lineHeight: 1 }}>
          {credits}
        </Typography>
      </Box>
    </Box>
  )
}

