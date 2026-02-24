import { IconButton } from '@mui/material'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import { useTheme } from '@mui/material/styles'

interface BrowseFilterProps {
  onClick?: () => void
}

export default function BrowseFilter({ onClick }: BrowseFilterProps) {
  const theme = useTheme()

  return (
    <IconButton
      aria-label="Filter"
      onClick={onClick}
      sx={{
        width: 44,
        height: 44,
        borderRadius: 2,
        bgcolor: theme.palette.background.default,
        color: theme.palette.text.primary,
      }}
    >
      <FilterAltIcon />
    </IconButton>
  )
}

