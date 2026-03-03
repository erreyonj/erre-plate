import { Box, Typography } from '@mui/material'
import { LocationOn } from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'
import { useBrowseFilters } from '../../hooks/useBrowseFilters'
import { useState } from 'react'
import NeighborhoodSelectorModal from './NeighborhoodSelectModal'
import { neighborhoodNameByID, neighborhoodZipCodeByID } from '../../utils/neighborhoodByID'

interface LocationDisplayProps {
  location?: string
}

export default function LocationDisplay() {
  const theme = useTheme()
  const { neighborhood, setNeighborhood } = useBrowseFilters()
  const [open, setOpen] = useState(false)

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, cursor: 'pointer' }} onClick={()=> setOpen(true)}>
      <LocationOn sx={{color: theme.palette.primary.main}} />
      <Typography sx={{ color: theme.palette.text.primary, fontSize: 16 }}>
        Browse{' '}
        <Box component="span" sx={{ color: theme.palette.warning.main, fontWeight: 700 }}>
          {neighborhoodNameByID(neighborhood)}
        </Box>{' '}
        Chefs:
      </Typography>

      <NeighborhoodSelectorModal
        open={open}
        onClose={() => setOpen(false)}
        onSelect={(id: number | null) => {
          setNeighborhood(id)
          setOpen(false)
        }}
      />
          </Box>
  )
}

