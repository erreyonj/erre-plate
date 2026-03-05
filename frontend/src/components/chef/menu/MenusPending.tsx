import { Box, Typography } from '@mui/material'
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu'

export default function MenusPending() {
  return (
    <Box
      sx={{
        py: 6,
        px: 3,
        textAlign: 'center',
        borderRadius: 3,
        border: '1px dashed rgba(0,0,0,0.15)',
      }}
    >
      <RestaurantMenuIcon
        sx={{
          fontSize: 40,
          mb: 1,
          opacity: 0.6,
        }}
      />

      <Typography variant="h6" sx={{ fontWeight: 700 }}>
        Menus Coming Soon
      </Typography>

      <Typography
        variant="body2"
        sx={{ mt: 1, opacity: 0.75 }}
      >
        This chef hasn’t published their weekly menus yet.
      </Typography>
    </Box>
  )
}