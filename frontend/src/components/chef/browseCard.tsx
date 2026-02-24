import { Box, Card, Chip, IconButton, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import FavoriteIcon from '@mui/icons-material/Favorite'
import SoupKitchenIcon from '@mui/icons-material/SoupKitchen'
import StarIcon from '@mui/icons-material/Star'
import type { ChefCard } from '../../types/user'

type BrowseCardProps = {
  chef: ChefCard
}

export default function BrowseCard({ chef }: BrowseCardProps) {
  const theme = useTheme()

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 3,
        borderColor: 'rgba(0,0,0,0.12)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <IconButton
        aria-label={chef.liked ? 'Remove from favorites' : 'Add to favorites'}
        sx={{
          position: 'absolute',
          top: 6,
          right: 6,
          bgcolor: '#fff',
          boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          '&:hover': { bgcolor: '#fff' },
        }}
      >
        {chef.liked ? (
          <FavoriteIcon sx={{ color: theme.palette.error.main }} fontSize="small" />
        ) : (
          <FavoriteBorderIcon sx={{ color: theme.palette.error.main }} fontSize="small" />
        )}
      </IconButton>

      <Box
        sx={{
          height: 88,
          bgcolor: theme.palette.primary.light,
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: 2,
            bgcolor: theme.palette.primary.light,
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <SoupKitchenIcon sx={{ fontSize: 42, color: '#fff' }} />
        </Box>
      </Box>

      <Box sx={{ px: 1.25, pt: 1, pb: 1.25 }}>
        <Typography sx={{ fontWeight: 800, color: '#000', fontSize: 14 }} noWrap>
          {chef.name}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
          <Typography sx={{ color: '#000', fontWeight: 700, fontSize: 14 }}>
            {chef.rating.toFixed(1)}
          </Typography>
          <StarIcon sx={{ color: theme.palette.warning.main, fontSize: 18 }} />
          <Typography sx={{ color: 'rgba(0,0,0,0.6)', fontSize: 12 }}>
            ({chef.reviews})
          </Typography>
        </Box>

        <Typography sx={{ color: 'rgba(0,0,0,0.7)', fontSize: 12, mt: 0.25 }}>
          From <Box component="span" sx={{ color: '#000', fontWeight: 800 }}>${chef.priceFrom}</Box>
          + / meal
        </Typography>

        <Chip
          label={chef.availabilityLabel}
          size="small"
          sx={{
            mt: 1,
            width: '100%',
            justifyContent: 'center',
            fontWeight: 700,
            color: chef.availabilityTone === 'success' ? '#fff' : '#000',
            bgcolor:
              chef.availabilityTone === 'success'
                ? theme.palette.success.dark
                : theme.palette.warning.light,
            borderRadius: 999,
          }}
        />
      </Box>
    </Card>
  )
}
