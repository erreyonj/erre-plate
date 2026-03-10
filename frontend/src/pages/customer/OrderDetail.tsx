import { useParams, useNavigate } from 'react-router-dom'
import {
  Container,
  Box,
  Typography,
  Stack,
  Chip,
  Divider,
  Button,
  CircularProgress,
  Paper,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu'
import { useOrderQuery } from '../../hooks/useOrders'
import OrderStatusTimeline from '../../components/customer/OrderStatusTimeline'

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

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: order, isLoading, isError } = useOrderQuery(id)

  if (isLoading) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    )
  }

  if (isError || !order) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Typography variant="h6" color="error" gutterBottom>
          Order not found.
        </Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/customer/orders')}>
          Back to orders
        </Button>
      </Container>
    )
  }

  const menu = order.order_menu
  const chefName = order.chef
    ? `${order.chef.first_name ?? ''} ${order.chef.last_name ?? ''}`.trim()
    : 'Chef'

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      {/* Back */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/customer/orders')}
        sx={{ mb: 3, textTransform: 'none', fontWeight: 600 }}
      >
        My Orders
      </Button>

      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={3}>
        <Box>
          <Typography variant="h5" fontWeight={700}>
            {menu?.menu_name ?? 'Weekly Menu'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            by {chefName}
          </Typography>
        </Box>
        <Chip
          label={order.status}
          color={STATUS_COLORS[order.status] ?? 'default'}
          sx={{ textTransform: 'capitalize', fontWeight: 600 }}
        />
      </Stack>

      {/* Dishes */}
      {menu && menu.items.length > 0 && (
        <Paper variant="outlined" sx={{ borderRadius: 3, p: 2.5, mb: 3 }}>
          <Stack direction="row" alignItems="center" spacing={1} mb={1.5}>
            <RestaurantMenuIcon fontSize="small" color="action" />
            <Typography variant="subtitle2" fontWeight={700}>
              Menu Items
            </Typography>
          </Stack>
          <Stack spacing={1}>
            {menu.items.map((item) => (
              <Box key={item.id}>
                <Typography variant="body2" fontWeight={600}>
                  {item.dish_name}
                </Typography>
                {item.dish_description && (
                  <Typography variant="caption" color="text.secondary">
                    {item.dish_description}
                  </Typography>
                )}
              </Box>
            ))}
          </Stack>
        </Paper>
      )}

      {/* Totals */}
      <Paper variant="outlined" sx={{ borderRadius: 3, p: 2.5, mb: 3 }}>
        <Typography variant="subtitle2" fontWeight={700} mb={1.5}>
          Order Summary
        </Typography>
        <Stack spacing={1}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" color="text.secondary">Subtotal</Typography>
            <Typography variant="body2">${order.subtotal}</Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" color="text.secondary">Platform fee</Typography>
            <Typography variant="body2">${order.platform_fee}</Typography>
          </Stack>
          {parseFloat(order.tax) > 0 && (
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">Tax</Typography>
              <Typography variant="body2">${order.tax}</Typography>
            </Stack>
          )}
          <Divider />
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="subtitle2" fontWeight={700}>Total</Typography>
            <Typography variant="subtitle2" fontWeight={700}>
              ${order.total} {order.currency}
            </Typography>
          </Stack>
        </Stack>
      </Paper>

      {/* Delivery info */}
      {(order.delivery_date || order.delivery_address) && (
        <Paper variant="outlined" sx={{ borderRadius: 3, p: 2.5, mb: 3 }}>
          <Typography variant="subtitle2" fontWeight={700} mb={1.5}>
            Delivery
          </Typography>
          {order.delivery_date && (
            <Typography variant="body2" color="text.secondary">
              Date:{' '}
              {new Date(order.delivery_date).toLocaleDateString(undefined, {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </Typography>
          )}
          {order.delivery_address && (
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              {[
                order.delivery_address.street,
                order.delivery_address.city,
                order.delivery_address.state,
                order.delivery_address.zip,
              ]
                .filter(Boolean)
                .join(', ')}
            </Typography>
          )}
        </Paper>
      )}

      {/* Status timeline */}
      <Paper variant="outlined" sx={{ borderRadius: 3, p: 2.5 }}>
        <OrderStatusTimeline
          events={order.status_history}
          currentStatus={order.status}
        />
      </Paper>
    </Container>
  )
}
