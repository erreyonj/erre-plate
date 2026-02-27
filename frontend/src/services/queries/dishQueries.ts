import { api } from '../api'
import type { Dish } from '../../types/menu'

export const fetchChefDishes = async (): Promise<Dish[]> => {
  const res = await api.get('/chef/dishes')
  return res.data
}

export const createDish = async (
  payload: Omit<Dish, 'id'>
): Promise<Dish> => {
  const res = await api.post('/chef/dishes', payload)
  return res.data
}