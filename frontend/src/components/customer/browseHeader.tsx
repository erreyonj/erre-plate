import { Box, useTheme } from '@mui/material'
import LocationDisplay from './locationDisplay'
import BrowseFilter from './browseFilter'
import SearchBar from '../global/searchBar'

export default function BrowseHeader() {
  const theme = useTheme()
  return (
    <Box id="BROWSE_HEADER" 
      className={`mb-4 py-4 rounded-md drop`} 
      sx={{ 
        position:'sticky', top:0, 
        zIndex:(theme) => theme.zIndex.appBar - 1,  
        pl: 2,
        boxShadow: '0 12px 12px rgb(0 0 0 / 0.15)',
        bgcolor: theme.palette.background.default
    }}>
      <Box className='gap-3' sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <SearchBar width='22rem' placeholder="Search" aria-label="Search chefs" />
        <BrowseFilter />
      </Box>
        <LocationDisplay />

        <Box
          sx={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: -38,
            height: 40,
            bgcolor: 'transparent',

            backdropFilter: 'blur(32px)',
            WebkitBackdropFilter: 'blur(32px)',

            maskImage: 'linear-gradient(to bottom, black, transparent)',
            WebkitMaskImage: 'linear-gradient(to bottom, black, transparent)',

            pointerEvents: 'none',
          }}
        />
    </Box>
  )
}

