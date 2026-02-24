import { Box } from '@mui/material'
import CreditsDisplay from '../user/creditsDisplay'
import LocationDisplay from './locationDisplay'
import BrowseFilter from './browseFilter'
import SearchBar from '../global/searchBar'

export default function BrowseHeader() {
  return (
    <Box id="BROWSE_HEADER">
      <Box  sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <CreditsDisplay />
        <LocationDisplay />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <BrowseFilter />
        <SearchBar placeholder="Search" aria-label="Search chefs" />
      </Box>
    </Box>
  )
}

