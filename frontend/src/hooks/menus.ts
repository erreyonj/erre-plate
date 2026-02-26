import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../services/api'
import type { MenuScope, MealType } from '../types/menu'

export type MenuStatus = 'draft' | 'published' | 'archived'

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
    dish: {
      id: number
      name: string
      description: string
      meal_type: 'breakfast' | 'lunch' | 'dinner'
      ingredients: unknown
      dietary_tags: unknown
    }
  }>
}

const CHEF_MENUS_KEY = ['chefMenus'] as const

export function useChefMenus() {
  return useQuery({
    queryKey: CHEF_MENUS_KEY,
    queryFn: async (): Promise<WeeklyMenuSummary[]> => {
      const res = await api.get('/chef/weekly-menus')
      return res.data
    },
  })
}

export function useWeeklyMenu(menuId: number | string | undefined) {
  return useQuery({
    queryKey: [...CHEF_MENUS_KEY, 'detail', menuId],
    enabled: !!menuId,
    queryFn: async (): Promise<WeeklyMenuDetail> => {
      const res = await api.get(`/chef/weekly-menus/${menuId}`)
      return res.data
    },
  })
}

export function useCreateWeeklyMenu() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: Partial<WeeklyMenuDetail>) => {
      const res = await api.post('/chef/weekly-menus', payload)
      return res.data as WeeklyMenuDetail
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHEF_MENUS_KEY })
    },
  })
}

export function useUpdateWeeklyMenu() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: number | string
      payload: Partial<WeeklyMenuDetail>
    }) => {
      const res = await api.patch(`/chef/weekly-menus/${id}`, payload)
      return res.data as WeeklyMenuDetail
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHEF_MENUS_KEY })
    },
  })
}

export function usePublishWeeklyMenu() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number | string) => {
      const res = await api.patch(`/chef/weekly-menus/${id}/publish`)
      return res.data as WeeklyMenuDetail
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHEF_MENUS_KEY })
    },
  })
}

export function useArchiveWeeklyMenu() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number | string) => {
      const res = await api.patch(`/chef/weekly-menus/${id}/archive`)
      return res.data as WeeklyMenuDetail
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHEF_MENUS_KEY })
    },
  })
}

