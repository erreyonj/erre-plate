import { Card, CardContent, Chip, IconButton, Stack, TextField, Typography } from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import type { AssignedDish } from '../../../types/menu'

interface AssignedDishCardProps {
  assignedDish: AssignedDish
  onChangeMealsCovered: (mealsCovered: number) => void
  onRemove: () => void
}

export default function AssignedDishCard({
  assignedDish,
  onChangeMealsCovered,
  onRemove,
}: AssignedDishCardProps) {
  const { dish, meals_covered, meal_type } = assignedDish

  function handleMealsChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = Math.max(1, Math.min(3, Number(e.target.value) || 0))
    onChangeMealsCovered(value)
  }

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 2,
      }}
    >
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
          <div>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {dish.name}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              className="line-clamp-2 mt-0.5"
            >
              {dish.description}
            </Typography>
          </div>
          <IconButton aria-label="Remove dish from menu" size="small" onClick={onRemove}>
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip
              size="small"
              label={meal_type}
              sx={{ textTransform: 'capitalize', fontWeight: 600 }}
            />
            <div className="hidden md:flex flex-wrap gap-1">
              {dish.dietary_tags.map((tag) => (
                <Chip key={tag} label={tag} size="small" variant="outlined" />
              ))}
            </div>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2" color="text.secondary">
              Meals covered
            </Typography>
            <TextField
              size="small"
              type="number"
              value={meals_covered}
              onChange={handleMealsChange}
              inputProps={{ min: 1, max: 3 }}
              sx={{ width: 72 }}
            />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  )
}

