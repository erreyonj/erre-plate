import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@mui/material'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import type { Location } from 'react-router-dom'

type FromState = {
  from?: Location
}

interface BackToBrowseButtonProps {
  /** Button label */
  label?: string
  /** Fallback path when no `from` state is available */
  fallback?: string
}

/**
 * Navigates back to the page stored in `location.state.from` (set by the
 * caller via `navigate(path, { state: { from: location } })`).
 * Falls back to `fallback` when no state is present — safe on hard refresh.
 */
export default function BackToBrowseButton({
  label = 'Back to Chefs',
  fallback = '/customer/browse',
}: BackToBrowseButtonProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as FromState | null)?.from

  const handleBack = () => {
    if (from) {
      // Restore exact pathname + search params (e.g. /customer/browse?cuisine=Thai&rating=4)
      navigate({ pathname: from.pathname, search: from.search, hash: from.hash })
    } else {
      navigate(fallback)
    }
  }

  return (
    <>
    {from && (
      <Button
        startIcon={<ArrowBackRoundedIcon fontSize="small" />}
        onClick={handleBack}
        size="small"
        sx={{
          textTransform: 'none',
          fontWeight: 600,
          color: 'text.secondary',
          px: 0,
          '&:hover': {
            color: 'text.primary',
            bgcolor: 'transparent',
          },
        }}
        disableRipple
      >
        {label}
      </Button>
    )}
    </>
  )
}
