import {
  Box,
  Typography,
  Stack,
  Chip,
  useTheme,
} from '@mui/material'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import type { PublicMenuDetail } from '../../../types/menu'
import { getMenuScopeLabel } from '../../../utils/getMenuScopeLabel'

interface MenuSummaryCardProps {
  menu: PublicMenuDetail
  chefName: string
}

export default function MenuSummaryCard({ menu, chefName }: MenuSummaryCardProps) {
  const theme = useTheme()

  const dishCount = menu.assigned_dishes?.length ?? 0
  const scopeLabel = getMenuScopeLabel(menu.menu_scope)

  return (
    <Box
      sx={{
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: theme.palette.background.paper,
        p: 2.5,
      }}
    >
      <Typography variant="h6" fontWeight={700} mb={0.5}>
        {menu.title}
      </Typography>

      <Typography variant="body2" color="text.secondary" mb={1.5}>
        by {chefName}
      </Typography>

      {menu.description && (
        <Typography variant="body2" color="text.secondary" mb={1.5}>
          {menu.description}
        </Typography>
      )}

      <Stack direction="row" spacing={1} flexWrap="wrap" mb={1.5} sx={{ gap: 0.75 }}>
        <Chip
          size="small"
          label={scopeLabel}
          sx={{ textTransform: 'capitalize', fontWeight: 600 }}
        />
        <Chip
          size="small"
          icon={<CalendarTodayIcon sx={{ fontSize: '14px !important' }} />}
          label={`${menu.duration_days} day plan`}
          variant="outlined"
        />
        <Chip
          size="small"
          icon={<RestaurantIcon sx={{ fontSize: '14px !important' }} />}
          label={`${dishCount} ${dishCount === 1 ? 'dish' : 'dishes'}`}
          variant="outlined"
        />
      </Stack>

      <Typography variant="h5" fontWeight={700}>
        ${menu.base_price}
      </Typography>
    </Box>
  )
}
