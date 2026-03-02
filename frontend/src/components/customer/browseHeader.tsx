import { Box } from '@mui/material'
import LocationDisplay from './locationDisplay'
import BrowseFilter from './browseFilter'
import SearchBar from '../global/searchBar'

export default function BrowseHeader() {
  return (
    <Box id="BROWSE_HEADER" className={`mb-4 rounded-md drop p-1`} sx={{boxShadow: '0 12px 12px rgb(0 0 0 / 0.15)'}}>
      <Box className='gap-3' sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <SearchBar width='22rem' placeholder="Search" aria-label="Search chefs" />
        <BrowseFilter />
      </Box>
        <LocationDisplay />
    </Box>
  )
}

