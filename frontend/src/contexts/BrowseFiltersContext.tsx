import { createContext, useContext } from "react"
import { useSearchParams } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

type BrowseFiltersContextType = {
  neighborhood: number | null
  effectiveNeighborhood: number | null
  setNeighborhood: (id: number | null) => void
}

const BrowseFiltersContext = createContext<BrowseFiltersContextType | undefined>(undefined)

export function BrowseFiltersProvider({ children }: { children: React.ReactNode }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const { user } = useAuth()

  const rawNeighborhood = searchParams.get("neighborhood")

  const neighborhood =
    rawNeighborhood && rawNeighborhood !== "0"
      ? Number(rawNeighborhood)
      : null

  const effectiveNeighborhood =
    neighborhood ?? user?.neighborhood_id ?? null

  const setNeighborhood = (id: number | null) => {
    const params = new URLSearchParams(searchParams)

    if (id) {
      params.set("neighborhood", id.toString())
    } else {
      params.delete("neighborhood")
    }

    setSearchParams(params)
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

export function useBrowseFilters() {
    const context = useContext(BrowseFiltersContext)
  
    if (!context) {
      throw new Error("useBrowseFilters must be used within BrowseFiltersProvider")
    }
  
    return context
  }