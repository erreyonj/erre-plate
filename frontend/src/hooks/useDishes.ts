import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  fetchChefDishes,
  createDish,
} from '../services/queries/dishQueries'

const CHEF_DISHES_KEY = ['chefDishes'] as const

export function useChefDishes() {
  return useQuery({
    queryKey: CHEF_DISHES_KEY,
    queryFn: fetchChefDishes,
  })
}

export function useCreateDish() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createDish,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHEF_DISHES_KEY })
    },
  })
}