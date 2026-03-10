import {
  Box,
  Typography,
  Stack,
  Chip,
  ButtonBase,
  Button,
  useTheme,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import type { MenuScope, WeeklyMenuSummary } from '../../../types/menu'
import type { ScopeCounts } from '../../../pages/customer/OrderBuilder'

type ActiveScope = MenuScope | 'all'

const SCOPE_LABELS: Record<ActiveScope, string> = {
  full: 'B+L+D',
  breakfast_only: 'Breakfast',
  lunch_only: 'Lunch',
  dinner_only: 'Dinner',
  all: 'All',
}

interface OrderSlide2ListProps {
  activeScope: ActiveScope
  scopeCounts: ScopeCounts
  menus: WeeklyMenuSummary[]
  onScopeSwitch: (scope: ActiveScope) => void
  onMenuSelect: (menuId: number) => void
  onBack: () => void
}

export default function OrderSlide2List({
  activeScope,
  scopeCounts,
  menus,
  onScopeSwitch,
  onMenuSelect,
  onBack,
}: OrderSlide2ListProps) {
  const theme = useTheme()

  const scopeKeys = (
    Object.keys(SCOPE_LABELS) as ActiveScope[]
  ).filter((s) => scopeCounts[s] > 0)

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
        onClick={onBack}
        sx={{ alignSelf: 'flex-start', mb: 2, textTransform: 'none', fontWeight: 600 }}
      >
        Menu type
      </Button>

      <Typography variant="h6" fontWeight={700} mb={2}>
        Choose a menu
      </Typography>

      {/* Scope Selector */}
      <Stack direction="row" spacing={0.75} mb={3} sx={{ flexWrap: 'wrap', gap: 0.75 }}>
        {scopeKeys.map((scope) => (
          <Chip
            key={scope}
            label={SCOPE_LABELS[scope]}
            variant={scope === activeScope ? 'filled' : 'outlined'}
            color={scope === activeScope ? 'primary' : 'default'}
            onClick={() => onScopeSwitch(scope)}
            sx={{ fontWeight: 600, cursor: 'pointer' }}
          />
        ))}
      </Stack>

      {/* Menu List */}
      {menus.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography variant="body2" color="text.secondary">
            No menus available for this scope.
          </Typography>
        </Box>
      ) : (
        <Stack spacing={1.5}>
          {menus.map((menu) => (
            <ButtonBase
              key={menu.id}
              onClick={() => onMenuSelect(menu.id)}
              sx={{ display: 'block', width: '100%', textAlign: 'left', borderRadius: 3 }}
            >
              <Box
                sx={{
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
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  mb={1}
                >
                  <Typography variant="subtitle1" fontWeight={600}>
                    {menu.title}
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={700} sx={{ flexShrink: 0, ml: 1 }}>
                    ${menu.base_price}
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip
                    size="small"
                    label={menu.menu_scope.replace(/_/g, ' ')}
                    sx={{ textTransform: 'capitalize', fontWeight: 500 }}
                  />
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <CalendarTodayIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                    <Typography variant="caption" color="text.secondary">
                      {menu.duration_days} day plan
                    </Typography>
                  </Stack>
                </Stack>
              </Box>
            </ButtonBase>
          ))}
        </Stack>
      )}
    </Box>
  )
}
