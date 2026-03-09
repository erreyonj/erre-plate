import { Box, Card, Chip, IconButton, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import SoupKitchenIcon from '@mui/icons-material/SoupKitchen'
import StarIcon from '@mui/icons-material/Star'
import type { PublicChefProfile } from '../../types/profile'
import { Link, useLocation } from 'react-router-dom'

type BrowseCardProps = {
  chef: PublicChefProfile
  liked?: boolean
}

export default function BrowseCard({ chef, liked = false }: BrowseCardProps) {
  const theme = useTheme()
  const location = useLocation()
  

  const fullName = `${chef.first_name} ${chef.last_name}`
  const rating = Number(chef.rating_average || 0)
  const hourlyRate = Number(chef.hourly_rate)

  const isAvailable =
    chef.is_available

  const availabilityLabel = isAvailable
    ? `Available • Order by ${chef.cutoff_day.slice(0,3)}`
    : 'Currently Unavailable'

  const availabilityTone = isAvailable ? 'success' : 'warning'

  return (
    <Card
      id={`CHEF_CARD_${chef.slug}`}
      variant="outlined"
      sx={{
        borderRadius: 3,
        borderColor: 'rgba(0,0,0,0.12)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <IconButton
        aria-label="Toggle favorite"
        sx={{
          position: 'absolute',
          top: 6,
          right: 6,
          bgcolor: '#fff',
          boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          '&:hover': { bgcolor: '#fff' },
        }}
      >
        <FavoriteBorderIcon
          sx={{ color: theme.palette.error.main }}
          fontSize="small"
        />
      </IconButton>

      {/* Header Visual */}
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
            bgcolor: theme.palette.primary.main,
            display: 'grid',
            placeItems: 'center',
          }}
        >
          {chef.photo_url 
            ? <img src={`${chef.photo_url}`} height={25} width={20}/>
            : <SoupKitchenIcon sx={{ fontSize: 42, color: '#fff' }} />
          }
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ px: 1.5, pt: 1, pb: 1.5 }}>
        <Link to={`/chef/${chef.slug}`} state={{ from: location }}>
          <Typography
            sx={{ fontWeight: 800, color: theme.palette.text.primary, fontSize: 15 }}
            noWrap
          >
            {fullName || 'Private Chef'}
          </Typography>
        </ Link>

        {/* Rating */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
          <Typography sx={{ color: theme.palette.text.primary, fontWeight: 700, fontSize: 14 }}>
            {rating.toFixed(1)}
          </Typography>
          <StarIcon
            sx={{ color: theme.palette.warning.main, fontSize: 18 }}
          />
          <Typography sx={{ color: 'rgba(0,0,0,0.6)', fontSize: 12 }}>
            ({chef.rating_count})
          </Typography>
        </Box>

        {/* Pricing */}
        <Typography sx={{ color: 'rgba(0,0,0,0.7)', fontSize: 13, mt: 0.5 }}>
          From{' '}
          <Box component="span" sx={{ color: theme.palette.text.primary, fontWeight: 800 }}>
            ${hourlyRate}
          </Box>{' '}
          / hr
        </Typography>

        {/* Specialties */}
        {chef.specialties && chef.specialties.length > 0 && (
          <Typography
            sx={{
              color: 'rgba(0,0,0,0.6)',
              fontSize: 12,
              mt: 0.5,
            }}
            noWrap
          >
            {chef.specialties.slice(0, 2).join(' • ')}
          </Typography>
        )}

        {/* Availability Chip */}
        <Chip
          label={availabilityLabel}
          size="small"
          sx={{
            mt: 1.25,
            width: '100%',
            justifyContent: 'center',
            fontWeight: 700,
            color: availabilityTone === 'success' ? '#fff' : '#000',
            bgcolor:
              availabilityTone === 'success'
                ? theme.palette.success.dark
                : theme.palette.warning.light,
            borderRadius: 999,
          }}
        />
      </Box>
    </Card>
  )
}