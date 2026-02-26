export type MenuScope = 'full' | 'breakfast_only' | 'lunch_only' | 'dinner_only'

export type MenuStatus = 'draft' | 'published' | 'archived'

export type MealType = 'breakfast' | 'lunch' | 'dinner'

export interface Ingredient {
  name: string
  quantity: string
  unit: string
}

export interface Dish {
  id: string
  name: string
  description: string
  meal_type: MealType
  ingredients: Ingredient[]
  dietary_tags: string[]
}

export interface AssignedDish {
  id: string
  dish: Dish
  meals_covered: number
  meal_type: MealType
}

export interface WeeklyMenu {
  id: string
  title: string
  duration_days: 5 | 7
  menu_scope: MenuScope
  required_meal_count: number
  base_price: number
  status: MenuStatus
  is_default?: boolean
  assigned_dishes: AssignedDish[]
}

export function calculateRequiredMealCount(durationDays: 5 | 7, scope: MenuScope): number {
  if (scope === 'full') {
    return durationDays * 3
  }
  return durationDays
}

