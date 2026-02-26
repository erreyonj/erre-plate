import { Box, CircularProgress, Typography } from '@mui/material'
import type { MenuScope } from '../../../types/menu'

interface MenuCompletionIndicatorProps {
  durationDays: 5 | 7
  scope: MenuScope
  requiredTotal: number
  breakfastCount: number
  lunchCount: number
  dinnerCount: number
  isValid: boolean
}

export default function MenuCompletionIndicator({
  durationDays,
  scope,
  requiredTotal,
  breakfastCount,
  lunchCount,
  dinnerCount,
  isValid,
}: MenuCompletionIndicatorProps) {
  const totalAssigned = breakfastCount + lunchCount + dinnerCount
  const progress = requiredTotal === 0 ? 0 : Math.min(100, (totalAssigned / requiredTotal) * 100)

  function requiredFor(meal: 'breakfast' | 'lunch' | 'dinner') {
    if (scope === 'full') return durationDays
    if (scope === 'breakfast_only') return meal === 'breakfast' ? durationDays : 0
    if (scope === 'lunch_only') return meal === 'lunch' ? durationDays : 0
    if (scope === 'dinner_only') return meal === 'dinner' ? durationDays : 0
    return 0
  }

  const circleColor = isValid ? 'success.main' : 'warning.main'

  return (
    <Box
      sx={{
        borderRadius: 3,
        border: '1px solid rgba(0,0,0,0.08)',
        p: 3,
        bgcolor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 700 }}>
        Menu completion
      </Typography>

      <Box className="flex items-center gap-4">
        <Box className="relative inline-flex">
          <CircularProgress
            variant="determinate"
            value={100}
            size={80}
            thickness={4}
            sx={{ color: 'rgba(0,0,0,0.08)' }}
          />
          <CircularProgress
            variant="determinate"
            value={progress}
            size={80}
            thickness={4}
            sx={{
              color: circleColor,
              position: 'absolute',
              left: 0,
              top: 0,
            }}
          />
          <Box
            className="absolute inset-0 flex items-center justify-center"
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              {requiredTotal === 0 ? 0 : Math.round(progress)}%
            </Typography>
          </Box>
        </Box>

        <Box className="space-y-1 text-sm">
          <Typography variant="body2">
            Breakfast: <strong>{breakfastCount}</strong> / {requiredFor('breakfast')}
          </Typography>
          <Typography variant="body2">
            Lunch: <strong>{lunchCount}</strong> / {requiredFor('lunch')}
          </Typography>
          <Typography variant="body2">
            Dinner: <strong>{dinnerCount}</strong> / {requiredFor('dinner')}
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            Total: <strong>{totalAssigned}</strong> / {requiredTotal}
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

