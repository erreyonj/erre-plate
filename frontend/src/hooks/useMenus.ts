import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  fetchChefMenus,
  fetchWeeklyMenu,
  createWeeklyMenu,
  updateWeeklyMenu,
  publishWeeklyMenu,
  archiveWeeklyMenu,
} from '../services/queries/menuQueries'

const CHEF_MENUS_KEY = ['chefMenus'] as const

export function useChefMenus() {
  return useQuery({
    queryKey: CHEF_MENUS_KEY,
    queryFn: fetchChefMenus,
  })
}

export function useWeeklyMenu(menuId: number | string | undefined) {
  return useQuery({
    queryKey: [...CHEF_MENUS_KEY, 'detail', menuId],
    enabled: !!menuId,
    queryFn: () => fetchWeeklyMenu(menuId as number | string),
  })
}

export function useCreateWeeklyMenu() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createWeeklyMenu,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHEF_MENUS_KEY })
    },
  })
}

export function useUpdateWeeklyMenu() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateWeeklyMenu,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHEF_MENUS_KEY })
    },
  })
}

export function usePublishWeeklyMenu() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: publishWeeklyMenu,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHEF_MENUS_KEY })
    },
  })
}

export function useArchiveWeeklyMenu() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: archiveWeeklyMenu,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHEF_MENUS_KEY })
    },
  })
}