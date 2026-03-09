import { useState } from 'react'
import { Chip, Menu, MenuItem, ListItemText, ListItemIcon } from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import CheckIcon from '@mui/icons-material/Check'
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu'
import { useBrowseFilters } from '../../hooks/useBrowseFilters'

const CUISINES = [
  'Japanese', 'BBQ', 'Vegan', 'Italian', 'French', 'Mediterranean',
  'Thai', 'Korean', 'Farm-to-Table', 'American', 'Southern', 'Soul Food',
  'Creole', 'Cajun', 'Tex-Mex', 'Southwestern', 'Mexican', 'Spanish',
  'Indian', 'Chinese', 'Vietnamese',
]

const CuisineSelect = () => {
  const { filters, setFilter } = useBrowseFilters()
  const [anchor, setAnchor] = useState<null | HTMLElement>(null)
  const open = Boolean(anchor)
  const selected = filters.cuisine ?? null

  const handleSelect = (cuisine: string) => {
    setFilter('cuisine', cuisine === selected ? null : cuisine)
    setAnchor(null)
  }

  return (
    <>
      <Chip
        label={selected ?? 'Any cuisine'}
        icon={<RestaurantMenuIcon fontSize="small" />}
        deleteIcon={<KeyboardArrowDownIcon />}
        onClick={(e) => setAnchor(e.currentTarget)}
        onDelete={(e) => setAnchor(e.currentTarget)}
        color={selected ? 'primary' : 'default'}
        variant={selected ? 'filled' : 'outlined'}
        sx={{ alignSelf: 'flex-start', cursor: 'pointer' }}
      />

      <Menu
        anchorEl={anchor}
        open={open}
        onClose={() => setAnchor(null)}
        slotProps={{ paper: { sx: { maxHeight: 320, minWidth: 200 } } }}
        transformOrigin={{ horizontal: 'left', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
      >
        {CUISINES.map((cuisine) => (
          <MenuItem
            key={cuisine}
            selected={cuisine === selected}
            onClick={() => handleSelect(cuisine)}
            dense
          >
            <ListItemText primary={cuisine} />
            {cuisine === selected && (
              <ListItemIcon sx={{ minWidth: 'auto', ml: 1 }}>
                <CheckIcon fontSize="small" color="primary" />
              </ListItemIcon>
            )}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

export default CuisineSelect
