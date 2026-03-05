import useEmblaCarousel from 'embla-carousel-react'
import { Box } from '@mui/material'

interface PhotoCarouselProps {
  images: string[]
  height?: number
}

export default function FeaturedMenuPhotoCarousel({
  images,
  height = 280,
}: PhotoCarouselProps) {
  const [emblaRef] = useEmblaCarousel({ loop: true })

  return (
    <Box
      ref={emblaRef}
      sx={{
        overflow: 'hidden',
        width: '100%',
        height,
        borderRadius: 3,
      }}
    >
      <Box sx={{ display: 'flex', height: '100%' }}>
        {images.map((url, index) => (
          <Box
            key={index}
            sx={{
              flex: '0 0 100%',
              backgroundColor: 'grey.200',
              backgroundImage: url ? `url(${url})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        ))}
      </Box>
    </Box>
  )
}