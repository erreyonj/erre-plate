import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Stack,
  Button,
  CircularProgress,
  Divider,
  useTheme,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { usePublicMenuDetail } from '../../../hooks/useMenus'
import { useCreateOrderMutation } from '../../../hooks/useOrders'
import MenuSummaryCard from './MenuSummaryCard'
import DishDetailCard from './DishDetailCard'
import { useState } from 'react'
import { Alert, Snackbar } from '@mui/material'

interface OrderSlide3DetailsProps {
  menuId: number | null
  chefName: string
  onBack: () => void
}

export default function OrderSlide3Details({
  menuId,
  chefName,
  onBack,
}: OrderSlide3DetailsProps) {
  const theme = useTheme()
  const navigate = useNavigate()
  const { data: menu, isLoading, isError } = usePublicMenuDetail(
    menuId ?? undefined
  )
  const { mutate: createOrder, isPending: isOrdering } = useCreateOrderMutation()
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handlePurchase = () => {
    if (!menuId) return
    // I believe from this step we'd actually send customer to payment processing
    // The callback from provider (Stripe? whats good for chefs?) would take them to /customer/orders/order.id
    createOrder(
      { weekly_menu_id: menuId },
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

  // No menu selected yet — show placeholder
  if (!menuId) {
    return (
      <Box sx={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', px: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Select a menu to view details.
        </Typography>
      </Box>
    )
  }

  if (isLoading) {
    return (
      <Box sx={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (isError || !menu) {
    return (
      <Box sx={{ minHeight: '100dvh', px: 3, py: 4, maxWidth: 480, mx: 'auto' }}>
        <Typography color="error" gutterBottom>
          Could not load menu details.
        </Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={onBack}>
          Back to menus
        </Button>
      </Box>
    )
  }

  const dishes = menu.assigned_dishes ?? []

  return (
    <Box
      sx={{
        height: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        maxWidth: 480,
        mx: 'auto',
      }}
    >
      {/* Top bar — fixed */}
      <Box sx={{ px: 3, pt: 4, pb: 1, flexShrink: 0 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          sx={{ mb: 2, textTransform: 'none', fontWeight: 600 }}
        >
          Back to menus
        </Button>

        <MenuSummaryCard menu={menu} chefName={chefName} />
      </Box>

      <Divider sx={{ mx: 3, my: 1 }} />

      {/* Dish list — scrollable */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          px: 3,
          pb: 2,
          // Subtle scroll indicator
          '&::-webkit-scrollbar': { width: 4 },
          '&::-webkit-scrollbar-thumb': {
            bgcolor: theme.palette.divider,
            borderRadius: 2,
          },
        }}
      >
        {dishes.length === 0 ? (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              No dishes assigned to this menu yet.
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 1,
              overflow: 'hidden',
            }}
          >
            {dishes.map((assigned) => (
              <DishDetailCard
                key={assigned.id}
                dish={assigned.dish}
                mealType={assigned.meal_type}
              />
            ))}
          </Box>
        )}
      </Box>

      {/* Purchase Ticket — fixed footer */}
      <Box
        sx={{
          flexShrink: 0,
          px: 3,
          py: 2.5,
          borderTop: `1px solid ${theme.palette.divider}`,
          bgcolor: theme.palette.background.paper,
        }}
      >
        <Stack spacing={1.5}>
          <Button
            variant="contained"
            size="large"
            fullWidth
            disabled={isOrdering}
            onClick={handlePurchase}
            startIcon={
              isOrdering ? <CircularProgress size={16} color="inherit" /> : undefined
            }
            sx={{
              borderRadius: 3,
              fontWeight: 700,
              py: 1.5,
              textTransform: 'none',
              fontSize: '1rem',
            }}
          >
            {isOrdering ? 'Placing order…' : `Purchase Menu — $${menu.base_price}`}
          </Button>

          <Button
            fullWidth
            onClick={onBack}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              color: 'text.secondary',
            }}
          >
            Return to Menu List
          </Button>
        </Stack>
      </Box>

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
    </Box>
  )
}
