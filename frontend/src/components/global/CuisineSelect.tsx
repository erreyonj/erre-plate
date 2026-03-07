import { useBrowseFilters } from "../../hooks/useBrowseFilters"
import { MenuItem, Select } from "@mui/material"

const CuisineSelect = () => {
    const { filters, setFilter } = useBrowseFilters()

  return (
    <Select
        fullWidth
        value={filters.cuisine ?? ''}
        onChange={(e) => setFilter('cuisine', e.target.value)}
    >
        <MenuItem value={'thai'}>Option 1</MenuItem>
        <MenuItem>Option 2</MenuItem>
        <MenuItem>Option 3</MenuItem>
    </Select>
  )
}

export default CuisineSelect

