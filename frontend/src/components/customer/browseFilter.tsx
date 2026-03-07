import { Badge, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material'
import FilterListIcon from '@mui/icons-material/FilterList'
import { useTheme } from '@mui/material/styles'
import { countActiveFilters } from '../../utils/getFilterCount'
import { useBrowseFilters } from '../../hooks/useBrowseFilters'
import { useState } from 'react'
import CuisineSelect from '../global/CuisineSelect'

interface BrowseFilterProps {
  onClick?: () => void
}

export default function BrowseFilter({ onClick }: BrowseFilterProps) {
  const theme = useTheme()
  const { filters, clearFilters } = useBrowseFilters()
  const [open, setOpen] = useState(false)
  const count = countActiveFilters(filters)

  return (
    <>
    <IconButton onClick={() => setOpen(true)}
      aria-label="Filter"
      sx={{
        width: 44,
        height: 44,
        borderRadius: 2,
        bgcolor: theme.palette.background.paper,
        color: theme.palette.text.primary,
      }}
    >
      <Badge badgeContent={count} color="warning">
        <FilterListIcon />
      </Badge>
    </IconButton>

    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
      <DialogTitle>Filters</DialogTitle>

      <DialogContent>

        {/* We can improve these with menu components */}
        <CuisineSelect />  

        {/* <RatingSelect /> */}

      </DialogContent>

      <DialogActions>
        <Button onClick={clearFilters}>Clear</Button>
        <Button onClick={() => setOpen(false)} variant="contained">
          Apply
        </Button>
      </DialogActions>
    </Dialog>
    </>
  )
}

