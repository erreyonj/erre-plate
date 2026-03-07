import { Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import type { ChefQueryFilters } from '../types/queryParams'


export function useBrowseFilters() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { user } = useAuth()
  const navigate = useNavigate()


  const neighborhoodParam = searchParams.get('neighborhood')
  const cuisineParam = searchParams.get('cuisine')
  const ratingParam = searchParams.get('rating')
  const searchParam = searchParams.get('search')

  const parsedNeighborhood =
    neighborhoodParam === 'all'
      ? null
      : neighborhoodParam
      ? Number(neighborhoodParam)
      : null

  const effectiveNeighborhood =
    neighborhoodParam === 'all'
      ? null
      : parsedNeighborhood ?? user?.neighborhood_id ?? null

  const filters: ChefQueryFilters = {
    neighborhood: effectiveNeighborhood,
    cuisine: cuisineParam ?? undefined,
    rating: ratingParam ? Number(ratingParam) : undefined,
    search: searchParam ?? undefined,
  }

  const setFilter = (key: string, value: string | number | null) => {
    const params = new URLSearchParams(searchParams)
    console.log('value: ', value);
    if (value === undefined || value === '') return

    if (value === null) {
      params.set(key, 'all')
    } else {
      params.set(key, value.toString())
    }

    setSearchParams(params)
  }

  const clearFilters = () => {
    navigate('/customer/browse', {replace: true})
  }

  const setNeighborhood = (value: number | 'all') => {
    const params = new URLSearchParams(searchParams)
    params.set('neighborhood', value === 'all' ? 'all' : value.toString())
    setSearchParams(params)
  }

  return {
    filters,
    clearFilters,
    setFilter,
    setNeighborhood,
  }
}