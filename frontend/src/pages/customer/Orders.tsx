import { Box, Typography, Stack, CircularProgress, useTheme } from '@mui/material'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import { useOrdersQuery } from '../../hooks/useOrders'
import OrderSummaryCard from '../../components/customer/OrderSummaryCard'

export default function Orders() {
  const theme = useTheme()
  const { data: orders, isLoading, isError } = useOrdersQuery()

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (isError) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Typography variant="body2" color="error">
          Could not load orders.
        </Typography>
      </Box>
    )
  }

  if (!orders || orders.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1.5,
          py: 8,
          px: 2,
          textAlign: 'center',
        }}
      >
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            bgcolor: theme.palette.action.hover,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ReceiptLongIcon color="disabled" />
        </Box>
        <Typography variant="subtitle1" fontWeight={600}>
          No orders yet
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Browse chefs and place your first order!
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ px: 2, py: 3 }}>
      <Typography variant="h6" fontWeight={700} mb={2.5}>
        My Orders
      </Typography>
      <Stack spacing={1.5}>
        {orders.map((order) => (
          <OrderSummaryCard key={order.id} order={order} />
        ))}
      </Stack>
    </Box>
  )
}
