import { useSearchParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export function useBrowseFilters() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { user } = useAuth()

  const rawNeighborhood = searchParams.get('neighborhood')

  // Normalize to number or null
  const neighborhood =
    rawNeighborhood && rawNeighborhood !== '0'
      ? Number(rawNeighborhood)
      : null

  // Fallback to logged-in user's neighborhood
  const effectiveNeighborhood =
    neighborhood ?? user?.neighborhood_id ?? null

  const setNeighborhood = (id: number | null) => {
    const params = new URLSearchParams(searchParams)

    if (id) {
      params.set('neighborhood', id.toString())
    } else {
      params.delete('neighborhood')
    }

    setSearchParams(params)
  }

  return {
    neighborhood: effectiveNeighborhood,
    setNeighborhood,
  }
}