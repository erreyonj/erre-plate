import { Box, Card, CardContent, Typography, Button, Chip } from '@mui/material'
import useEmblaCarousel from 'embla-carousel-react'
import { useEffect } from 'react'
import type { PublicWeeklyMenu, WeeklyMenuSummary } from '../../../types/menu'

interface WeeklyMenuCardProps {
  menu: WeeklyMenuSummary
  onSelect?: (menu: WeeklyMenuSummary) => void
}

export default function WeeklyMenuCard({
  menu,
  onSelect,
}: WeeklyMenuCardProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    dragFree: false,
  })

  useEffect(() => {
    if (!emblaApi) return

    const interval = setInterval(() => {
      emblaApi.scrollNext()
    }, 3000)

    return () => clearInterval(interval)
  }, [emblaApi])

//   const images =
//     menu.dishes
//       ?.flatMap((dish) => dish.photos ?? [])
//       .map((p) => p.url) ?? []

//   const slides = images.length > 0 ? images : ['', '', '']

  return (
    <Card
      elevation={2}
      sx={{
        borderRadius: 3,
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* PHOTO CAROUSEL */}

      {/* <Box
        ref={emblaRef}
        sx={{
          overflow: 'hidden',
          height: 160,
          background: '#eee',
        }}
      >
        <Box sx={{ display: 'flex', height: '100%' }}>
          {slides.map((src, index) => (
            <Box
              key={index}
              sx={{
                flex: '0 0 100%',
                backgroundImage: src ? `url(${src})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          ))}
        </Box>
      </Box> */}

      {/* CONTENT */}

      <CardContent
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          {menu.title}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {menu.duration_days} day plan • 
          {/* {menu.required_meal_count} meals */}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Scope: {menu.menu_scope.replace('_', ' ')}
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        <Typography variant="h6" fontWeight={700}>
          ${menu.base_price}
        </Typography>

        {onSelect && (
          <Button
          variant="contained"
          fullWidth
          onClick={() => onSelect(menu)}
          >
            View Menu
          </Button>
        )}
        <Chip label={menu.status} size="small" />
      </CardContent>
    </Card>
  )
}