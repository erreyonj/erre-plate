// components/ui/ChefReviewsPlaceholder.tsx

import { Card, CardContent, Typography, Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import StarBorderIcon from '@mui/icons-material/StarBorder'

export default function ChefReviewsPlaceholder() {
  const theme = useTheme()

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 3,
        borderStyle: 'dashed',
        borderColor: 'rgba(0,0,0,0.2)',
        bgcolor:
          theme.palette.mode === 'light'
            ? '#f9fafb'
            : theme.palette.background.paper,
      }}
    >
      <CardContent
        sx={{
          textAlign: 'center',
          py: 4,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mb: 1,
            opacity: 0.7,
          }}
        >
          <StarBorderIcon />
        </Box>

        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            mb: 0.5,
          }}
        >
          No reviews yet
        </Typography>

        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
          }}
        >
          Once customers start ordering from this chef, their reviews will
          appear here.
        </Typography>
      </CardContent>
    </Card>
  )
}