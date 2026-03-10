import { Box, Typography, Stack, CircularProgress, useTheme } from '@mui/material'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import { useChefOrdersQuery } from '../../hooks/useOrders'
import ChefOrderCard from '../../components/chef/ChefOrderCard'

export default function Tickets() {
  const theme = useTheme()
  const { data: orders, isLoading, isError } = useChefOrdersQuery()

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
          Orders from customers will appear here.
        </Typography>
      </Box>
    )
  }

  const activeOrders = orders.filter(
    (o) => !['completed', 'cancelled'].includes(o.status)
  )
  const pastOrders = orders.filter((o) =>
    ['completed', 'cancelled'].includes(o.status)
  )

  return (
    <Box sx={{ px: 2, py: 3 }}>
      {activeOrders.length > 0 && (
        <>
          <Typography variant="h6" fontWeight={700} mb={2}>
            Active Orders
          </Typography>
          <Stack spacing={1.5} mb={4}>
            {activeOrders.map((order) => (
              <ChefOrderCard key={order.id} order={order} />
            ))}
          </Stack>
        </>
      )}

      {pastOrders.length > 0 && (
        <>
          <Typography variant="subtitle1" fontWeight={600} color="text.secondary" mb={1.5}>
            Past Orders
          </Typography>
          <Stack spacing={1.5}>
            {pastOrders.map((order) => (
              <ChefOrderCard key={order.id} order={order} />
            ))}
          </Stack>
        </>
      )}
    </Box>
  )
}
