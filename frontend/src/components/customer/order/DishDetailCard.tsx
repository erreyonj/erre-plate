import {
  Box,
  Typography,
  Chip,
  Stack,
  useTheme,
} from '@mui/material'
import type { Dish, Ingredient } from '../../../types/menu'

interface DishDetailCardProps {
  dish: Dish
  mealType?: string
}

export default function DishDetailCard({ dish, mealType }: DishDetailCardProps) {
  const theme = useTheme()

  const ingredients: Ingredient[] = Array.isArray(dish.ingredients)
    ? dish.ingredients
    : []

  return (
    <Box
      sx={{
        borderBottom: `1px solid ${theme.palette.divider}`,
        py: 2,
        px: 2.5,
        '&:last-child': { borderBottom: 'none' },
      }}
    >
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={0.5}>
        <Typography variant="subtitle2" fontWeight={700}>
          {dish.name}
        </Typography>
        {mealType && (
          <Chip
            size="small"
            label={mealType}
            sx={{ textTransform: 'capitalize', fontWeight: 500, ml: 1, flexShrink: 0 }}
          />
        )}
      </Stack>

      {/* Description */}
      {dish.description && (
        <Typography variant="body2" color="text.secondary" mb={1}>
          {dish.description}
        </Typography>
      )}

      {/* Ingredients table */}
      {ingredients.length > 0 && (
        <Box
          sx={{
            borderRadius: 1.5,
            bgcolor: theme.palette.action.hover,
            overflow: 'hidden',
          }}
        >
          {ingredients.map((ing, i) => (
            <Stack
              key={i}
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{
                px: 1.5,
                py: 0.75,
                borderBottom:
                  i < ingredients.length - 1
                    ? `1px solid ${theme.palette.divider}`
                    : 'none',
              }}
            >
              <Typography variant="caption" fontWeight={500}>
                {ing.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {ing.quantity}
                {ing.unit ? ` ${ing.unit}` : ''}
              </Typography>
            </Stack>
          ))}
        </Box>
      )}

      {/* Dietary tags */}
      {dish.dietary_tags && dish.dietary_tags.length > 0 && (
        <Stack direction="row" spacing={0.5} mt={1} flexWrap="wrap" sx={{ gap: 0.5 }}>
          {dish.dietary_tags.map((tag) => (
            <Chip key={tag} label={tag} size="small" variant="outlined" />
          ))}
        </Stack>
      )}
    </Box>
  )
}
