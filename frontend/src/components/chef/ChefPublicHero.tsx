import {
    Box,
    Typography,
    Avatar,
    Chip,
    Button,
    Stack,
    Rating,
    Divider
  } from '@mui/material'
  import type { PublicChefProfile } from '../../types/profile'
  
  export default function ChefPublicHero({ chef }: {chef: PublicChefProfile}) {
    
    const fullName = `${chef.first_name} ${chef.last_name}`
  
    const ratingValue = parseFloat(chef.rating_average ?? '0')
    const hourlyRateNumber = parseFloat(chef.hourly_rate ?? '0')
  
    const canOrder = chef.status === 'approved' && chef.is_available
  
    return (
      <Box
        sx={{
          p: { xs: 3, md: 5 },
          borderRadius: 4,
          bgcolor: 'background.paper',
          boxShadow: 3,
        }}
      >
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={4}
          alignItems={{ md: 'center' }}
        >
          {/* Avatar */}
          <Avatar
            src={chef?.photo_url || undefined}
            alt={fullName}
            sx={{
              width: 120,
              height: 120,
              fontSize: 40,
            }}
          >
            {chef?.first_name?.[0]}
          </Avatar>
  
          {/* Main Info */}
          <Box flex={1}>
            <Typography variant="h4" fontWeight={700}>
              {fullName}
            </Typography>
  
            {chef.tagline && (
              <Typography
                variant="subtitle1"
                color="text.secondary"
                mt={1}
              >
                {chef.tagline}
              </Typography>
            )}
  
            {/* Specialties */}
            {chef.specialties && chef.specialties.length > 0 && (
              <Stack
                direction="row"
                spacing={1}
                mt={2}
                flexWrap="wrap"
              >
                {chef.specialties.map((spec, index) => (
                  <Chip key={index} label={spec} />
                ))}
              </Stack>
            )}
  
            {/* Rating */}
            {chef.rating_count > 0 && (
              <Stack direction="row" spacing={1} alignItems="center" mt={2}>
                <Rating
                  value={ratingValue}
                  precision={0.5}
                  readOnly
                />
                <Typography variant="body2" color="text.secondary">
                  ({chef.rating_count} reviews)
                </Typography>
              </Stack>
            )}
  
            {/* Rate + Availability */}
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              mt={3}
              flexWrap="wrap"
            >
              <Chip
                label={`$${hourlyRateNumber}/hr`}
                color="primary"
                variant="outlined"
              />
  
              <Chip
                label={chef.is_available ? 'Available This Cycle' : 'Unavailable'}
                color={chef.is_available ? 'success' : 'default'}
                variant={chef.is_available ? 'filled' : 'outlined'}
              />
            </Stack>
          </Box>
  
          {/* CTA */}
          <Box>
            <Button
              variant="contained"
              size="large"
              disabled={!canOrder}
              sx={{
                px: 4,
                py: 1.5,
                fontWeight: 600,
                borderRadius: 3,
              }}
            >
              {canOrder ? 'Order Now' : 'Not Available'}
            </Button>
          </Box>
        </Stack>
  
        {/* Status Banner */}
        {chef.status !== 'approved' && (
          <>
            <Divider sx={{ my: 3 }} />
            <Typography color="warning.main" variant="body2">
              This chef profile is currently {chef.status}.
            </Typography>
          </>
        )}
      </Box>
    )
  }