import type { MenuScope } from '../types/menu'

export const getMenuScopeLabel = (scope: MenuScope) => {
  switch (scope) {
    case 'full':
      return 'B + L + D'
    case 'breakfast_only':
      return 'Breakfast'
    case 'lunch_only':
      return 'Lunch'
    case 'dinner_only':
      return 'Dinner'
  }
}