import {
  Badge,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  Typography,
} from '@mui/material'
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { useTheme } from '@mui/material/styles'
import { countActiveFilters } from '../../utils/getFilterCount'
import { useBrowseFilters } from '../../hooks/useBrowseFilters'
import { useState } from 'react'
import CuisineSelect from '../global/CuisineSelect'
import RatingSelect from '../global/RatingSelect'

interface BrowseFilterProps {
  onClick?: () => void
}

export default function BrowseFilter({ onClick }: BrowseFilterProps) {
  const theme = useTheme()
  const { filters, clearFilters } = useBrowseFilters()
  const [open, setOpen] = useState(false)
  const count = countActiveFilters(filters)

  const handleClose = () => setOpen(false)

  return (
    <>
      <IconButton
        onClick={() => setOpen(true)}
        aria-label="Open filters"
        sx={{
          width: 44,
          height: 44,
          borderRadius: 2,
          bgcolor: count > 0 ? 'primary.main' : theme.palette.background.paper,
          color: count > 0 ? 'primary.contrastText' : theme.palette.text.primary,
          transition: 'background-color 0.2s, color 0.2s',
          '&:hover': {
            bgcolor: count > 0 ? 'primary.dark' : theme.palette.action.hover,
          },
        }}
      >
        <Badge badgeContent={count} color="warning">
          <FilterListRoundedIcon />
        </Badge>
      </IconButton>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="xs"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: 3,
              overflow: 'hidden',
            },
          },
        }}
      >
        <DialogTitle sx={{ py: 2, px: 3 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="h6" fontWeight={700}>
                Filters
              </Typography>
              {count > 0 && (
                <Typography
                  variant="caption"
                  sx={{
                    bgcolor: 'warning.main',
                    color: 'warning.contrastText',
                    borderRadius: 999,
                    px: 1,
                    py: 0.25,
                    fontWeight: 700,
                    lineHeight: 1.6,
                  }}
                >
                  {count} active
                </Typography>
              )}
            </Stack>
            <IconButton size="small" onClick={handleClose} aria-label="Close filters">
              <CloseRoundedIcon fontSize="small" />
            </IconButton>
          </Stack>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ px: 3, py: 2.5 }}>
          <Stack spacing={3}>
            <Stack spacing={1.25}>
              <Typography
                variant="overline"
                sx={{ color: 'text.secondary', letterSpacing: 1.2, lineHeight: 1 }}
              >
                Cuisine
              </Typography>
              <CuisineSelect />
            </Stack>

            <Stack spacing={1.25}>
              <Typography
                variant="overline"
                sx={{ color: 'text.secondary', letterSpacing: 1.2, lineHeight: 1 }}
              >
                Minimum Rating
              </Typography>
              <RatingSelect />
            </Stack>
          </Stack>
        </DialogContent>

        <Divider />

        <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
          {count > 0 && (
            <Button
              onClick={clearFilters}
              color="inherit"
              sx={{ textTransform: 'none', color: 'text.secondary', flexShrink: 0 }}
            >
              Clear all
            </Button>
          )}
          <Button
            fullWidth
            variant="contained"
            onClick={handleClose}
            disableElevation
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, py: 1 }}
          >
            {count > 0 ? `Show results (${count} filter${count > 1 ? 's' : ''})` : 'Done'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
