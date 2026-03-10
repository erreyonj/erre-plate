import {
  Box,
  Typography,
  Stack,
  useTheme,
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import CancelIcon from '@mui/icons-material/Cancel'
import type { OrderStatusEvent } from '../../types/order'

const STEP_ORDER = ['pending', 'confirmed', 'preparing', 'ready', 'completed'] as const

interface OrderStatusTimelineProps {
  events: OrderStatusEvent[]
  currentStatus: string
}

export default function OrderStatusTimeline({
  events,
  currentStatus,
}: OrderStatusTimelineProps) {
  const theme = useTheme()
  const isCancelled = currentStatus === 'cancelled'

  const completedStatuses = new Set(events.map((e) => e.status))

  const getEventForStatus = (status: string) =>
    events.find((e) => e.status === status)

  return (
    <Box>
      <Typography variant="subtitle1" fontWeight={700} mb={2}>
        Order Progress
      </Typography>

      <Stack spacing={0}>
        {STEP_ORDER.map((step, i) => {
          const isDone = completedStatuses.has(step)
          const isCurrent = currentStatus === step
          const event = getEventForStatus(step)
          const isLast = i === STEP_ORDER.length - 1

          return (
            <Stack key={step} direction="row" spacing={2} alignItems="stretch">
              {/* Icon + connector */}
              <Stack alignItems="center" spacing={0} sx={{ minWidth: 24 }}>
                <Box sx={{ color: isDone ? theme.palette.success.main : theme.palette.action.disabled, mt: 0.25 }}>
                  {isDone ? (
                    <CheckCircleIcon fontSize="small" />
                  ) : (
                    <RadioButtonUncheckedIcon fontSize="small" />
                  )}
                </Box>
                {!isLast && (
                  <Box
                    sx={{
                      width: 2,
                      flex: 1,
                      minHeight: 24,
                      bgcolor: isDone
                        ? theme.palette.success.light
                        : theme.palette.divider,
                      my: 0.25,
                    }}
                  />
                )}
              </Stack>

              {/* Content */}
              <Box pb={isLast ? 0 : 2}>
                <Typography
                  variant="body2"
                  fontWeight={isCurrent ? 700 : 500}
                  color={isDone ? 'text.primary' : 'text.disabled'}
                  sx={{ textTransform: 'capitalize' }}
                >
                  {step}
                </Typography>
                {event && (
                  <Typography variant="caption" color="text.secondary" display="block">
                    {event.note && `${event.note} · `}
                    {new Date(event.created_at).toLocaleString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Typography>
                )}
              </Box>
            </Stack>
          )
        })}

        {/* Cancelled state */}
        {isCancelled && (
          <Stack direction="row" spacing={2} alignItems="center">
            <Box sx={{ color: theme.palette.error.main, minWidth: 24 }}>
              <CancelIcon fontSize="small" />
            </Box>
            <Box>
              <Typography variant="body2" fontWeight={700} color="error">
                Cancelled
              </Typography>
              {getEventForStatus('cancelled') && (
                <Typography variant="caption" color="text.secondary" display="block">
                  {getEventForStatus('cancelled')?.note && `${getEventForStatus('cancelled')?.note} · `}
                  {new Date(getEventForStatus('cancelled')!.created_at).toLocaleString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Typography>
              )}
            </Box>
          </Stack>
        )}
      </Stack>
    </Box>
  )
}
