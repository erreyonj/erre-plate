import { Box, Typography } from '@mui/material'
import { LocationOn } from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'
import { useBrowseFilters } from '../../hooks/useBrowseFilters'
import { useState } from 'react'
import NeighborhoodSelectorModal from './NeighborhoodSelectModal'
import { neighborhoodNameByID } from '../../utils/neighborhoodByID'


export default function LocationDisplay() {
  const theme = useTheme()
  const { filters, setNeighborhood } = useBrowseFilters()
  const [open, setOpen] = useState(false)
  const neighborhood = filters?.neighborhood

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, cursor: 'pointer' }}>
      <LocationOn sx={{color: theme.palette.primary.main}} />
      <Typography sx={{ color: theme.palette.text.primary, fontSize: 16 }}>
        Browse{' '}
        <Box component="span" sx={{ color: theme.palette.warning.main, fontWeight: 700 }} onClick={()=> setOpen(true)}>
          {neighborhoodNameByID(neighborhood)}
        </Box>{' '}
        Chefs:
      </Typography>

      <NeighborhoodSelectorModal
        open={open}
        onClose={() => {
          setOpen(false)
        }}
        onSelect={(id: number | 'all') => {
          setNeighborhood(id)
          // setOpen(false)
        }}
      />
    </Box>
  )
}

