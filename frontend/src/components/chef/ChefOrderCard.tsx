import {
  Box,
  Typography,
  Stack,
  Chip,
  Divider,
  useTheme,
} from '@mui/material'
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import ChefOrderStatusControls from './ChefOrderStatusControls'
import type { OrderSummary } from '../../types/order'

const STATUS_COLORS: Record<
  string,
  'default' | 'warning' | 'info' | 'success' | 'error' | 'primary' | 'secondary'
> = {
  pending:   'warning',
  confirmed: 'info',
  preparing: 'primary',
  ready:     'success',
  completed: 'default',
  cancelled: 'error',
}

interface ChefOrderCardProps {
  order: OrderSummary
}

export default function ChefOrderCard({ order }: ChefOrderCardProps) {
  const theme = useTheme()

  const placedDate = order.placed_at
    ? new Date(order.placed_at).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null

  return (
    <Box
      sx={{
        borderRadius: 3,
        bgcolor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        p: 2.5,
      }}
    >
      {/* Header row */}
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <RestaurantMenuIcon fontSize="small" color="action" />
          <Typography variant="subtitle1" fontWeight={700}>
            {order.menu_name ?? 'Weekly Menu'}
          </Typography>
        </Stack>
        <Chip
          label={order.status}
          color={STATUS_COLORS[order.status] ?? 'default'}
          size="small"
          sx={{ textTransform: 'capitalize', fontWeight: 600 }}
        />
      </Stack>

      {/* Meta */}
      <Stack spacing={0.5} mb={1.5}>
        {order.chef_name && (
          <Stack direction="row" spacing={0.75} alignItems="center">
            <PersonOutlineIcon fontSize="inherit" sx={{ color: 'text.disabled', fontSize: 14 }} />
            <Typography variant="body2" color="text.secondary">
              {order.chef_name}
            </Typography>
          </Stack>
        )}
        {placedDate && (
          <Stack direction="row" spacing={0.75} alignItems="center">
            <CalendarTodayIcon fontSize="inherit" sx={{ color: 'text.disabled', fontSize: 14 }} />
            <Typography variant="body2" color="text.secondary">
              Placed {placedDate}
            </Typography>
          </Stack>
        )}
      </Stack>

      <Divider sx={{ mb: 1.5 }} />

      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle2" fontWeight={700}>
          ${order.total} {order.currency}
        </Typography>

        <ChefOrderStatusControls
          orderId={order.id}
          currentStatus={order.status}
        />
      </Stack>
    </Box>
  )
}
