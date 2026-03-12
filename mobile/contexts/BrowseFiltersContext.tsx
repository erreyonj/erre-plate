import { createContext, useContext, useState, type ReactNode } from "react"
import { useAuth } from "./AuthContext"

type BrowseFiltersContextType = {
  neighborhood: number | null
  effectiveNeighborhood: number | null
  setNeighborhood: (id: number | null) => void
}

const BrowseFiltersContext = createContext<BrowseFiltersContextType | undefined>(undefined)

export function BrowseFiltersProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [neighborhood, setNeighborhoodState] = useState<number | null>(null)

  const effectiveNeighborhood = neighborhood ?? user?.neighborhood_id ?? null

  const setNeighborhood = (id: number | null) => {
    setNeighborhoodState(id)
  }

  return (
    <BrowseFiltersContext.Provider
      value={{
        neighborhood,
        effectiveNeighborhood,
        setNeighborhood,
      }}
    >
      {children}
    </BrowseFiltersContext.Provider>
  )
}

export function useBrowseFiltersContext() {
  const context = useContext(BrowseFiltersContext)
  if (!context) {
    throw new Error("useBrowseFiltersContext must be used within BrowseFiltersProvider")
  }
  return context
}
