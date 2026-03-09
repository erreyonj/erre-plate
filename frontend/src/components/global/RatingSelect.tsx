import { useState } from 'react'
import { Chip, Menu, MenuItem, ListItemText, ListItemIcon, Stack } from '@mui/material'
import StarRoundedIcon from '@mui/icons-material/StarRounded'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import CheckIcon from '@mui/icons-material/Check'
import { useBrowseFilters } from '../../hooks/useBrowseFilters'

const RATINGS = [
  { label: '5 stars only', value: 5 },
  { label: '4+ stars', value: 4 },
  { label: '3+ stars', value: 3 },
  { label: '2+ stars', value: 2 },
  { label: '1+ stars', value: 1 },
]

const StarRow = ({ count }: { count: number }) => (
  <Stack direction="row" spacing={0.25}>
    {Array.from({ length: 5 }).map((_, i) => (
      <StarRoundedIcon
        key={i}
        fontSize="small"
        sx={{ color: i < count ? 'warning.main' : 'action.disabled', fontSize: 16 }}
      />
    ))}
  </Stack>
)

const RatingSelect = () => {
  const { filters, setFilter } = useBrowseFilters()
  const [anchor, setAnchor] = useState<null | HTMLElement>(null)
  const open = Boolean(anchor)
  const selected = filters.rating ?? null
  const selectedLabel = RATINGS.find((r) => r.value === selected)?.label

  const handleSelect = (value: number) => {
    setFilter('rating', value === selected ? null : value)
    setAnchor(null)
  }

  return (
    <>
      <Chip
        label={selectedLabel ?? 'Any rating'}
        icon={<StarRoundedIcon fontSize="small" />}
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
        slotProps={{ paper: { sx: { minWidth: 200 } } }}
        transformOrigin={{ horizontal: 'left', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
      >
        {RATINGS.map((rating) => (
          <MenuItem
            key={rating.value}
            selected={rating.value === selected}
            onClick={() => handleSelect(rating.value)}
            dense
          >
            <Stack direction="row" alignItems="center" spacing={1} sx={{ flex: 1 }}>
              <StarRow count={rating.value} />
              <ListItemText
                primary={rating.label}
                slotProps={{ primary: { variant: 'body2' } }}
              />
            </Stack>
            {rating.value === selected && (
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

export default RatingSelect
