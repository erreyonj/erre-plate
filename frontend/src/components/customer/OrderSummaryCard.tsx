import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Chip,
  Stack,
  ButtonBase,
  useTheme,
} from '@mui/material'
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu'
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

interface OrderSummaryCardProps {
  order: OrderSummary
}

export default function OrderSummaryCard({ order }: OrderSummaryCardProps) {
  const theme = useTheme()
  const navigate = useNavigate()

  const placedDate = order.placed_at
    ? new Date(order.placed_at).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null

  return (
    <ButtonBase
      onClick={() => navigate(`/customer/orders/${order.id}`)}
      sx={{
        display: 'block',
        width: '100%',
        textAlign: 'left',
        borderRadius: 3,
      }}
    >
      <Box
        sx={{
          borderRadius: 3,
          bgcolor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          p: 2.5,
          transition: 'box-shadow 0.2s',
          '&:hover': { boxShadow: theme.shadows[3] },
        }}
      >
        <Stack direction="row" alignItems="flex-start" spacing={2}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2,
              bgcolor: theme.palette.action.hover,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <RestaurantMenuIcon fontSize="small" color="action" />
          </Box>

          <Box flex={1} minWidth={0}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              spacing={1}
            >
              <Typography variant="subtitle1" fontWeight={600} noWrap>
                {order.menu_name ?? 'Weekly Menu'}
              </Typography>
              <Chip
                label={order.status}
                color={STATUS_COLORS[order.status] ?? 'default'}
                size="small"
                sx={{ textTransform: 'capitalize', flexShrink: 0 }}
              />
            </Stack>

            <Typography variant="body2" color="text.secondary" mt={0.25}>
              {order.chef_name ?? 'Chef'}
            </Typography>

            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              mt={1}
            >
              <Typography variant="body2" color="text.secondary">
                {placedDate}
              </Typography>
              <Typography variant="subtitle2" fontWeight={700}>
                ${order.total}
              </Typography>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </ButtonBase>
  )
}
