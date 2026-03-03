import { Box, useTheme } from '@mui/material'
import LocationDisplay from './locationDisplay'
import BrowseFilter from './browseFilter'
import SearchBar from '../global/searchBar'

export default function BrowseHeader() {
  const theme = useTheme()
  return (
    <Box id="BROWSE_HEADER" 
      className={`mb-4 rounded-md drop p-1`} 
      sx={{ 
        position:'sticky', top:0, 
        zIndex:(theme) => theme.zIndex.appBar - 1,  
        
        boxShadow: '0 12px 12px rgb(0 0 0 / 0.15)',
        bgcolor: theme.palette.background.default
    }}>
      <Box className='gap-3' sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <SearchBar width='22rem' placeholder="Search" aria-label="Search chefs" />
        <BrowseFilter />
      </Box>
        <LocationDisplay />

        {/* <Box
          sx={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: -32,
            height: 40,

            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',

            maskImage: 'linear-gradient(to bottom, black, transparent)',
            WebkitMaskImage: 'linear-gradient(to bottom, black, transparent)',

            pointerEvents: 'none',
          }}
        /> */}
    </Box>
  )
}

