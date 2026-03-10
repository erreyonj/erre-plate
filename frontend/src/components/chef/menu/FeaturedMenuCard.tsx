import React from 'react'
import { Box, Typography, Button, Stack, Chip, Divider } from '@mui/material'
import type { PublicWeeklyMenu } from '../../../types/menu'
import FeaturedMenuPhotoCarousel from '../menu/FeaturedMenuPhotoCarousel'

interface FeaturedMenuCardProps {
    menu: PublicWeeklyMenu
    onOrder?: () => void
    /** Optional render prop — replaces the default "Order This Menu" button */
    orderButton?: React.ReactNode
  }

export default function FeaturedMenuCard({
  menu,
  onOrder,
  orderButton,
}: FeaturedMenuCardProps) {
  const price = menu.base_price ?? 0

  // Flatten all dish photos
  const images =
    menu.dishes
      ?.flatMap((dish) => dish.photos ?? [])
      .map((photo) => photo.url) ?? []

  const fallbackSlides = ['', '', '']

  const highlightedDishes =
    menu.dishes?.slice(0, 3).map((dish) => dish.name) ?? []

  return (
    <Box
      sx={{
        borderRadius: 4,
        bgcolor: 'background.paper',
        boxShadow: 3,
        overflow: 'hidden',
      }}
    >
      {/* Media */}
      <FeaturedMenuPhotoCarousel
        images={images.length ? images : fallbackSlides}
        height={320}
      />

      {/* Content */}
      <Box sx={{ p: 4 }}>
        <Stack spacing={2}>
          <Typography variant="h5" fontWeight={700}>
            {menu.title}
          </Typography>

          {/* {menu.description && (
            <Typography variant="body1" color="text.secondary">
              {menu.description}
            </Typography>
          )} */}

          {/* Dish Highlights */}
          {highlightedDishes.length > 0 && (
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {highlightedDishes.map((name, index) => (
                <Chip key={index} label={name} />
              ))}
            </Stack>
          )}

          <Divider />

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6" fontWeight={600}>
              ${price}
            </Typography>

            {orderButton ?? (
              <Button
                variant="contained"
                size="large"
                onClick={onOrder}
                sx={{
                  borderRadius: 3,
                  px: 3,
                  fontWeight: 600,
                }}
              >
                Order This Menu
              </Button>
            )}
          </Stack>
        </Stack>
      </Box>
    </Box>
  )
}