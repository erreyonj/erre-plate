import { api } from '../api'
import type { WeeklyMenuSummary, WeeklyMenuDetail } from '../../types/menu'

export const fetchChefMenus = async (): Promise<WeeklyMenuSummary[]> => {
  const res = await api.get('/chef/weekly-menus')
  return res.data
}

export const fetchWeeklyMenu = async (
  menuId: number | string
): Promise<WeeklyMenuDetail> => {
  const res = await api.get(`/chef/weekly-menus/${menuId}`)
  return res.data
}

export const createWeeklyMenu = async (
  payload: Partial<WeeklyMenuDetail>
): Promise<WeeklyMenuDetail> => {
  const res = await api.post('/chef/weekly-menus', payload)
  return res.data
}

export const updateWeeklyMenu = async ({
  id,
  payload,
}: {
  id: number | string
  payload: Partial<WeeklyMenuDetail>
}): Promise<WeeklyMenuDetail> => {
  const res = await api.patch(`/chef/weekly-menus/${id}`, payload)
  return res.data
}

export const publishWeeklyMenu = async (
  id: number | string
): Promise<WeeklyMenuDetail> => {
  const res = await api.patch(`/chef/weekly-menus/${id}/publish`)
  return res.data
}

export const archiveWeeklyMenu = async (
  id: number | string
): Promise<WeeklyMenuDetail> => {
  const res = await api.patch(`/chef/weekly-menus/${id}/archive`)
  return res.data
}