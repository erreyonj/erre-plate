import { Box, Typography } from '@mui/material'
import { LocationOn } from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'

interface LocationDisplayProps {
  location?: string
}

export default function LocationDisplay({ location = 'Madison' }: LocationDisplayProps) {
  const theme = useTheme()

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
      <LocationOn sx={{color: theme.palette.primary.main}} />
      <Typography sx={{ color: theme.palette.text.primary, fontSize: 16 }}>
        Browse{' '}
        <Box component="span" sx={{ color: theme.palette.warning.main, fontWeight: 700 }}>
          {location}
        </Box>{' '}
        Chefs:
      </Typography>
    </Box>
  )
}

