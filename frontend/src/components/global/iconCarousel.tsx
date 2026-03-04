// components/ui/IconCarousel.tsx
import useEmblaCarousel from 'embla-carousel-react'
import { useEffect } from 'react'
import { Box } from '@mui/material'

type IconCarouselProps = {
  slides: React.ReactNode[]
  autoPlayDelay?: number
}

export default function IconCarousel({
  slides,
  autoPlayDelay = 1800,
}: IconCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    dragFree: false,
  })

  useEffect(() => {
    if (!emblaApi) return

    const interval = setInterval(() => {
      emblaApi.scrollNext()
    }, autoPlayDelay)

    return () => clearInterval(interval)
  }, [emblaApi, autoPlayDelay])

  return (
    <Box
      ref={emblaRef}
      sx={{
        overflow: 'hidden',
        width: 72,
        height: 72,
      }}
    >
      <Box
        sx={{
          display: 'flex',
        }}
      >
        {slides.map((slide, index) => (
          <Box
            key={index}
            sx={{
              flex: '0 0 100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {slide}
          </Box>
        ))}
      </Box>
    </Box>
  )
}