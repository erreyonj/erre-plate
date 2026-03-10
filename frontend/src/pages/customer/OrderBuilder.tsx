import { useParams, useNavigate } from 'react-router-dom'
import { Box, Button, CircularProgress, Container, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { usePublicChefProfile } from '../../hooks/useProfiles'
import OrderCarousel from '../../components/customer/order/OrderCarousel'
import type { MenuScope, WeeklyMenuSummary } from '../../types/menu'

export type ScopeCounts = Record<MenuScope | 'all', number>

export default function OrderBuilder() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { data, isLoading, isError } = usePublicChefProfile(slug ?? '')

  if (isLoading) {
    return (
      <Container maxWidth="sm" sx={{ py: 10, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body2" color="text.secondary" mt={2}>
          Loading menu options…
        </Typography>
      </Container>
    )
  }

  if (isError || !data?.chef) {
    return (
      <Container maxWidth="sm" sx={{ py: 10 }}>
        <Typography variant="h6" color="error" gutterBottom>
          Chef not found.
        </Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
          Go back
        </Button>
      </Container>
    )
  }

  const { chef, featured_menu, weekly_menus } = data

  // Combine featured menu + weekly menus into a unified list of summaries.
  // The featured menu has full dish data; summaries have scope + pricing info.
  const allMenus: WeeklyMenuSummary[] = [
    ...(featured_menu
      ? [
          {
            id: featured_menu.id,
            title: featured_menu.title,
            duration_days: featured_menu.duration_days,
            menu_scope: featured_menu.menu_scope,
            required_meal_count: featured_menu.required_meal_count ?? 0,
            base_price: featured_menu.base_price,
            status: featured_menu.status,
            created_at: '',
            updated_at: '',
          } satisfies WeeklyMenuSummary,
        ]
      : []),
    ...(weekly_menus ?? []),
  ]

  // Derive scope availability counts
  const scopeCounts: ScopeCounts = {
    full: 0,
    breakfast_only: 0,
    lunch_only: 0,
    dinner_only: 0,
    all: allMenus.length,
  }
  for (const m of allMenus) {
    if (m.menu_scope in scopeCounts) {
      scopeCounts[m.menu_scope as MenuScope]++
    }
  }

  const chefName = `${chef.first_name} ${chef.last_name}`.trim()

  return (
    <Box sx={{ width: '100%', minHeight: '100dvh', overflow: 'hidden' }}>
      <OrderCarousel
        chef={chef}
        chefName={chefName}
        allMenus={allMenus}
        scopeCounts={scopeCounts}
        slug={slug ?? ''}
      />
    </Box>
  )
}
