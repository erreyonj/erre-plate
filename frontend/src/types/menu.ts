export type MenuScope = 'full' | 'breakfast_only' | 'lunch_only' | 'dinner_only'

export type MenuStatus = 'draft' | 'published' | 'archived'

export type MealType = 'breakfast' | 'lunch' | 'dinner'

export interface Ingredient {
  name: string
  quantity: string
  unit: string
}

export interface DishPhoto {
  id: number
  url: string
}

export interface Dish {
  id: string
  name: string
  description: string
  meal_type: MealType
  ingredients: Ingredient[]
  dietary_tags: string[]
  prep_time_minutes?: number | null
  photos?: DishPhoto[]
}

export interface AssignedDish {
  id: string
  dish: Dish
  meals_covered: number
  meal_type: MealType
}

export interface WeeklyMenuBuilder {
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

export interface PublicWeeklyMenu {
  id: number
  title: string
  duration_days: 5 | 7
  menu_scope: MenuScope
  required_meal_count?: number | null
  status: MenuStatus
  base_price: number
  dishes: Dish[]
  saved_by_customer_count?: number | null
  ordered_by_customer_count?: number | null
}

export interface WeeklyMenuSummary {
  id: number
  title: string
  duration_days: number
  menu_scope: MenuScope
  required_meal_count: number
  base_price: string | number
  status: MenuStatus
  created_at: string
  updated_at: string
}

export interface WeeklyMenuDetail extends WeeklyMenuSummary {
  description?: string | null
  assigned_dishes?: Array<{
    id: number
    dish_id: number
    meals_covered: number
    meal_type: MealType
    dish: Dish
  }>
}

/**
 * Full public menu detail — matches WeeklyMenuResource response shape.
 * Used for the customer order flow when viewing a single menu with all dishes.
 */
export interface PublicMenuDetail {
  id: number
  title: string
  description: string | null
  duration_days: number
  menu_scope: MenuScope
  required_meal_count: number
  base_price: string
  status: MenuStatus
  created_at: string
  updated_at: string
  assigned_dishes: Array<{
    id: number
    dish_id: number
    meals_covered: number
    meal_type: MealType
    dish: Dish
  }>
}

export interface MenuCardCarouselProps {
  menus: WeeklyMenuBuilder[]
}

export interface FeaturedMenuCardProps {
  menu: WeeklyMenuBuilder
  onOrder?: () => void
}

export function calculateRequiredMealCount(durationDays: 5 | 7, scope: MenuScope): number {
  if (scope === 'full') {
    return durationDays * 3
  }
  return durationDays
}

