import { useState } from 'react'
import {
  Box,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import type { Dish, Ingredient, MealType } from '../../../types/menu'
import IngredientInputRow from './IngredientInputRow'
import EplateButton from '../../global/EplateButton'

const DIETARY_TAG_OPTIONS = [
  'Vegetarian',
  'Vegan',
  'Gluten-free',
  'Dairy-free',
  'Nut-free',
  'Halal',
  'Kosher',
] as const

type DishFormValue = Omit<Dish, 'id'>

interface DishFormProps {
  initialValue?: Partial<DishFormValue>
  onSubmit: (dish: DishFormValue) => void
}

export default function DishForm({ initialValue, onSubmit }: DishFormProps) {
  const [name, setName] = useState(initialValue?.name ?? '')
  const [description, setDescription] = useState(initialValue?.description ?? '')
  const [mealType, setMealType] = useState<MealType>(initialValue?.meal_type ?? 'dinner')
  const [ingredients, setIngredients] = useState<Ingredient[]>(
    initialValue?.ingredients && initialValue.ingredients.length > 0
      ? initialValue.ingredients
      : [{ name: '', quantity: '', unit: '' }],
  )
  const [dietaryTags, setDietaryTags] = useState<string[]>(initialValue?.dietary_tags ?? [])

  function handleIngredientChange(index: number, ingredient: Ingredient) {
    setIngredients((prev) => prev.map((ing, i) => (i === index ? ingredient : ing)))
  }

  function handleAddIngredient() {
    setIngredients((prev) => [...prev, { name: '', quantity: '', unit: '' }])
  }

  function handleRemoveIngredient(index: number) {
    setIngredients((prev) => prev.filter((_, i) => i !== index))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const cleanedIngredients = ingredients.filter((ing) => ing.name.trim() !== '')

    const payload: DishFormValue = {
      name: name.trim(),
      description: description.trim(),
      meal_type: mealType,
      ingredients: cleanedIngredients,
      dietary_tags: dietaryTags,
    }

    onSubmit(payload)
  }

  return (
    <Box component="form" onSubmit={handleSubmit} className="space-y-3">
      <Box className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <TextField
          required
          size="small"
          label="Dish name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
        />
        <FormControl size="small" fullWidth>
          <InputLabel id="dish-meal-type-label">Meal type</InputLabel>
          <Select
            labelId="dish-meal-type-label"
            label="Meal type"
            value={mealType}
            onChange={(e) => setMealType(e.target.value as MealType)}
          >
            <MenuItem value="breakfast">Breakfast</MenuItem>
            <MenuItem value="lunch">Lunch</MenuItem>
            <MenuItem value="dinner">Dinner</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TextField
        size="small"
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        multiline
        minRows={2}
        fullWidth
      />

      <Box className="space-y-2">
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          Ingredients
        </Typography>
        <Box className="space-y-2">
          {ingredients.map((ingredient, index) => (
            <IngredientInputRow
              key={index}
              ingredient={ingredient}
              onChange={(ing) => handleIngredientChange(index, ing)}
              onRemove={() => handleRemoveIngredient(index)}
            />
          ))}
        </Box>
        <EplateButton
          type="button"
          variantStyle="ghost"
          size="small"
          onClick={handleAddIngredient}
          sx={{ mt: 0.5 }}
        >
          Add ingredient
        </EplateButton>
      </Box>

      <FormControl size="small" fullWidth>
        <InputLabel id="dietary-tags-label">Dietary tags</InputLabel>
        <Select
          labelId="dietary-tags-label"
          multiple
          value={dietaryTags}
          onChange={(e) => setDietaryTags(e.target.value as string[])}
          input={<OutlinedInput label="Dietary tags" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} size="small" />
              ))}
            </Box>
          )}
        >
          {DIETARY_TAG_OPTIONS.map((tag) => (
            <MenuItem key={tag} value={tag}>
              {tag}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box className="flex justify-end pt-2">
        <EplateButton type="submit" variantStyle="primary">
          Save dish
        </EplateButton>
      </Box>
    </Box>
  )
}

