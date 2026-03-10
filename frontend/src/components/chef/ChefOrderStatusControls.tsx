import { Stack, Button, CircularProgress } from '@mui/material'
import { useChefUpdateOrderStatusMutation } from '../../hooks/useOrders'
import type { OrderStatus } from '../../types/order'

const NEXT_STATUS: Record<string, { status: OrderStatus; label: string }> = {
  pending:   { status: 'confirmed', label: 'Confirm Order' },
  confirmed: { status: 'preparing', label: 'Start Preparing' },
  preparing: { status: 'ready', label: 'Mark Ready' },
  ready:     { status: 'completed', label: 'Complete' },
}

interface ChefOrderStatusControlsProps {
  orderId: number
  currentStatus: string
}

export default function ChefOrderStatusControls({
  orderId,
  currentStatus,
}: ChefOrderStatusControlsProps) {
  const { mutate, isPending } = useChefUpdateOrderStatusMutation()
  const next = NEXT_STATUS[currentStatus]

  if (!next) return null

  const handleAdvance = () => {
    mutate({ orderId, status: next.status })
  }

  return (
    <Stack direction="row" spacing={1} flexWrap="wrap">
      <Button
        variant="contained"
        size="small"
        disabled={isPending}
        onClick={handleAdvance}
        startIcon={isPending ? <CircularProgress size={14} color="inherit" /> : undefined}
        sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
      >
        {isPending ? 'Updating…' : next.label}
      </Button>
    </Stack>
  )
}
