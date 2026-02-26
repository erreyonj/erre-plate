import { Box, IconButton, TextField } from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import type { Ingredient } from '../../../types/menu'

interface IngredientInputRowProps {
  ingredient: Ingredient
  onChange: (ingredient: Ingredient) => void
  onRemove: () => void
}

export default function IngredientInputRow({
  ingredient,
  onChange,
  onRemove,
}: IngredientInputRowProps) {
  return (
    <Box className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_auto] gap-2 items-center">
      <TextField
        size="small"
        label="Ingredient"
        value={ingredient.name}
        onChange={(e) => onChange({ ...ingredient, name: e.target.value })}
        fullWidth
      />
      <TextField
        size="small"
        label="Qty"
        value={ingredient.quantity}
        onChange={(e) => onChange({ ...ingredient, quantity: e.target.value })}
        fullWidth
      />
      <TextField
        size="small"
        label="Unit"
        value={ingredient.unit}
        onChange={(e) => onChange({ ...ingredient, unit: e.target.value })}
        fullWidth
      />
      <IconButton aria-label="Remove ingredient" onClick={onRemove} edge="end">
        <DeleteOutlineIcon fontSize="small" />
      </IconButton>
    </Box>
  )
}

