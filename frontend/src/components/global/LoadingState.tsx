// components/ui/LoadingState.tsx
import { Box, CircularProgress, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

type LoadingStateProps = {
  carousel: React.ReactNode
  message?: string
}

export default function LoadingState({
  carousel,
  message = 'Cooking something special...',
}: LoadingStateProps) {
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
      }}
    >
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
        {/* Circular Progress Ring */}
        <CircularProgress
          size={120}
          thickness={4}
          sx={{
            position: 'absolute',
            color: theme.palette.primary.main,
          }}
        />

        {/* Carousel inside */}
        {carousel}
      </Box>

      <Typography
        variant="body2"
        sx={{
          opacity: 0.7,
          letterSpacing: 0.5,
        }}
      >
        {message}
      </Typography>
    </Box>
  )
}