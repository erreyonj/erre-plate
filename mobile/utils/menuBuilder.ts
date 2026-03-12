import type { AssignedDish, Dish, Ingredient } from '../types/menu'
import type { WeeklyMenuDetail } from '../types/menu'

export function mapAssignedDishesToUi(menu: WeeklyMenuDetail | undefined): AssignedDish[] {
  if (!menu || !menu.assigned_dishes) return []

  return menu.assigned_dishes.map((item) => {
    const dish: Dish = {
      id: String(item.dish.id),
      name: item.dish.name,
      description: item.dish.description,
      meal_type: item.dish.meal_type,
      ingredients: (Array.isArray(item.dish.ingredients)
        ? item.dish.ingredients
        : []) as Ingredient[],
      dietary_tags: (Array.isArray(item.dish.dietary_tags)
        ? item.dish.dietary_tags
        : []) as string[],
    }

    return {
      id: String(item.id),
      dish,
      meals_covered: item.meals_covered,
      meal_type: item.meal_type,
    }
  })
}

export function getMealCounts(menu: WeeklyMenuDetail | undefined) {
  if (!menu || !menu.assigned_dishes) {
    return { breakfast: 0, lunch: 0, dinner: 0, total: 0 }
  }

  let breakfast = 0
  let lunch = 0
  let dinner = 0

  menu.assigned_dishes.forEach((item) => {
    if (item.meal_type === 'breakfast') breakfast += item.meals_covered
    if (item.meal_type === 'lunch') lunch += item.meals_covered
    if (item.meal_type === 'dinner') dinner += item.meals_covered
  })

  return { breakfast, lunch, dinner, total: breakfast + lunch + dinner }
}

export function getPublishErrors(menu: WeeklyMenuDetail | undefined): string[] {
  if (!menu) return ['Menu could not be loaded.']

  const { breakfast, lunch, dinner, total } = getMealCounts(menu)
  const errors: string[] = []

  if (!menu.required_meal_count) {
    errors.push('Configure duration and scope to calculate required meal count.')
    return errors
  }

  if (total < menu.required_meal_count) {
    errors.push(
      `Assign ${menu.required_meal_count - total} more meal(s) to reach ${menu.required_meal_count} total.`,
    )
  } else if (total > menu.required_meal_count) {
    errors.push(
      `Reduce meals by ${total - menu.required_meal_count} to match the required total of ${menu.required_meal_count}.`,
    )
  }

  if (menu.menu_scope === 'full') {
    if (breakfast === 0) errors.push('Add at least one breakfast dish.')
    if (lunch === 0) errors.push('Add at least one lunch dish.')
    if (dinner === 0) errors.push('Add at least one dinner dish.')
  }

  if (menu.menu_scope === 'breakfast_only' && (lunch > 0 || dinner > 0)) {
    errors.push('Remove lunch and dinner dishes. This menu is breakfast-only.')
  }

  if (menu.menu_scope === 'lunch_only' && (breakfast > 0 || dinner > 0)) {
    errors.push('Remove breakfast and dinner dishes. This menu is lunch-only.')
  }

  if (menu.menu_scope === 'dinner_only' && (breakfast > 0 || lunch > 0)) {
    errors.push('Remove breakfast and lunch dishes. This menu is dinner-only.')
  }

  return errors
}
