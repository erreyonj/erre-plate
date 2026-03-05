import useEmblaCarousel from 'embla-carousel-react'
import { useEffect } from 'react'
import { Box, Typography } from '@mui/material'
import WeeklyMenuCard from './WeeklyMenuCard'
import type { WeeklyMenuSummary } from '../../../types/menu'

interface WeeklyMenu {
  id: number
  title: string
  description?: string
  price_per_meal?: string
  meal_count?: number
  start_date?: string
  end_date?: string
}

interface MenuCardCarouselProps {
  menus: WeeklyMenuSummary[] | undefined
}

export default function MenuCardCarousel({ menus }: MenuCardCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: false,
    dragFree: true,
  })

  useEffect(() => {
    if (!emblaApi) return
  }, [emblaApi])

  if (!menus || menus.length === 0) {
    return (
      <Typography color="text.secondary">
        No menus available right now.
      </Typography>
    )
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box
        ref={emblaRef}
        sx={{
          overflow: 'hidden',
          width: '100%',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: 2,
          }}
        >
          {menus.map((menu) => (
            <Box
              key={menu.id}
              sx={{
                flex: '0 0 280px',
              }}
            >
              <WeeklyMenuCard menu={menu} />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}