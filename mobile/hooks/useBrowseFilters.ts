import { useState, useCallback } from 'react'
import { useAuth } from '../contexts/AuthContext'
import type { ChefQueryFilters } from '../types/queryParams'

export function useBrowseFilters() {
  const { user } = useAuth()
  const [params, setParams] = useState<Record<string, string>>({})

  const neighborhoodParam = params.neighborhood ?? null
  const cuisineParam = params.cuisine ?? null
  const ratingParam = params.rating ?? null
  const searchParam = params.search ?? null

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

  const setFilter = useCallback((key: string, value: string | number | null) => {
    if (value === undefined || value === '') return

    setParams((prev) => {
      const next = { ...prev }
      if (value === null) {
        next[key] = 'all'
      } else {
        next[key] = value.toString()
      }
      return next
    })
  }, [])

  const clearFilters = useCallback(() => {
    setParams({})
  }, [])

  const setNeighborhood = useCallback((value: number | 'all') => {
    setParams((prev) => ({
      ...prev,
      neighborhood: value === 'all' ? 'all' : value.toString(),
    }))
  }, [])

  return {
    filters,
    clearFilters,
    setFilter,
    setNeighborhood,
  }
}
