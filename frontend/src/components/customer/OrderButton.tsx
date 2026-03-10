import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, CircularProgress, Snackbar, Alert, type ButtonProps } from '@mui/material'
import { useCreateOrderMutation } from '../../hooks/useOrders'

interface OrderButtonProps extends Omit<ButtonProps, 'onClick'> {
  weeklyMenuId?: number
  label?: string
}

export default function OrderButton({
  weeklyMenuId,
  label = 'Order This Menu',
  disabled,
  ...rest
}: OrderButtonProps) {
  const navigate = useNavigate()
  const { mutate, isPending } = useCreateOrderMutation()
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleOrder = () => {
    if (!weeklyMenuId) return
    mutate(
      { weekly_menu_id: weeklyMenuId },
      {
        onSuccess: (order) => {
          navigate(`/customer/orders/${order.id}`)
        },
        onError: (err: unknown) => {
          const msg =
            (err as { response?: { data?: { message?: string } } })?.response
              ?.data?.message ?? 'Failed to place order. Please try again.'
          setErrorMsg(msg)
        },
      }
    )
  }

  return (
    <>
      <Button
        variant="contained"
        size="large"
        disabled={isPending || disabled}
        onClick={handleOrder}
        startIcon={isPending ? <CircularProgress size={16} color="inherit" /> : undefined}
        sx={{
          borderRadius: 3,
          px: 3,
          fontWeight: 600,
          textTransform: 'none',
        }}
        {...rest}
      >
        {isPending ? 'Placing order…' : label}
      </Button>

      <Snackbar
        open={!!errorMsg}
        autoHideDuration={5000}
        onClose={() => setErrorMsg(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setErrorMsg(null)}>
          {errorMsg}
        </Alert>
      </Snackbar>
    </>
  )
}
