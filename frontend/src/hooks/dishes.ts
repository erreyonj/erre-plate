import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../services/api'
import type { Dish } from '../types/menu'

const CHEF_DISHES_KEY = ['chefDishes'] as const

export function useChefDishes() {
  return useQuery({
    queryKey: CHEF_DISHES_KEY,
    queryFn: async (): Promise<Dish[]> => {
      const res = await api.get('/chef/dishes')
      return res.data as Dish[]
    },
  })
}

export function useCreateDish() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: Omit<Dish, 'id'>): Promise<Dish> => {
      const res = await api.post('/chef/dishes', payload)
      return res.data as Dish
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHEF_DISHES_KEY })
    },
  })
}

