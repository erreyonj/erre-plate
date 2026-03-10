import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Stack,
  ButtonBase,
  useTheme,
  Button,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import {BreakfastDining, LunchDining, DinnerDining, MenuBook, FreeBreakfast} from '@mui/icons-material'
import type { MenuScope } from '../../../types/menu'
import type { ScopeCounts } from '../../../pages/customer/OrderBuilder'

type ActiveScope = MenuScope | 'all'

interface ScopeOption {
  value: ActiveScope
  label: string
  description: string
  icon: React.ReactNode
}

const SCOPE_OPTIONS: ScopeOption[] = [
  {
    value: 'full',
    label: 'B + L + D',
    description: 'Breakfast, Lunch & Dinner',
    icon: <RestaurantIcon />,
  },
  {
    value: 'breakfast_only',
    label: 'Breakfast Only',
    description: 'Morning meals',
    icon: <FreeBreakfast />,
  },
  {
    value: 'lunch_only',
    label: 'Lunch Only',
    description: 'Midday meals',
    icon: <LunchDining />,
  },
  {
    value: 'dinner_only',
    label: 'Dinner Only',
    description: 'Evening meals',
    icon: <DinnerDining />,
  },
  {
    value: 'all',
    label: 'View All',
    description: 'Browse every menu',
    icon: <MenuBook />,
  },
]

interface OrderSlide1ScopeProps {
  chefName: string
  scopeCounts: ScopeCounts
  onScopeSelect: (scope: ActiveScope) => void
  slug: string
}

export default function OrderSlide1Scope({
  chefName,
  scopeCounts,
  onScopeSelect,
  slug,
}: OrderSlide1ScopeProps) {
  const theme = useTheme()
  const navigate = useNavigate()

  const available = SCOPE_OPTIONS.filter((opt) => scopeCounts[opt.value] > 0)

  return (
    <Box
      sx={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        px: 3,
        py: 4,
        maxWidth: 480,
        mx: 'auto',
      }}
    >
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(`/chef/${slug}`)}
        sx={{ alignSelf: 'flex-start', mb: 3, textTransform: 'none', fontWeight: 600 }}
      >
        Back to chef
      </Button>

      <Typography variant="h5" fontWeight={700} mb={0.5}>
        Order from {chefName}
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={4}>
        Choose a menu type to get started.
      </Typography>

      <Stack spacing={1.5} flex={1}>
        {available.map((opt) => (
          <ButtonBase
            key={opt.value}
            onClick={() => onScopeSelect(opt.value)}
            sx={{
              display: 'flex',
              width: '100%',
              textAlign: 'left',
              borderRadius: 3,
            }}
          >
            <Box
              sx={{
                width: '100%',
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
                bgcolor: theme.palette.background.paper,
                p: 2.5,
                transition: 'box-shadow 0.15s, border-color 0.15s',
                '&:hover': {
                  boxShadow: theme.shadows[3],
                  borderColor: theme.palette.primary.main,
                },
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    bgcolor: theme.palette.action.hover,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: theme.palette.primary.main,
                    flexShrink: 0,
                  }}
                >
                  {opt.icon}
                </Box>

                <Box flex={1}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {opt.label}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {opt.description}
                  </Typography>
                </Box>

                <Typography variant="caption" color="text.disabled" sx={{ flexShrink: 0 }}>
                  {scopeCounts[opt.value]} {scopeCounts[opt.value] === 1 ? 'menu' : 'menus'}
                </Typography>
              </Stack>
            </Box>
          </ButtonBase>
        ))}
      </Stack>
    </Box>
  )
}
