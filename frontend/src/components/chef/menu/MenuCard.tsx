import { Card, CardContent, Chip, Stack, Typography, Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import type { WeeklyMenuSummary } from '../../../types/menu'
import EplateButton from '../../global/EplateButton'

interface MenuCardProps {
  menu: WeeklyMenuSummary
  onEdit: () => void
  onPublish: () => void
  onArchive: () => void
}

function formatScope(scope: WeeklyMenuSummary['menu_scope']): string {
  switch (scope) {
    case 'full':
      return 'Full week · Breakfast + Lunch + Dinner'
    case 'breakfast_only':
      return 'Breakfast only'
    case 'lunch_only':
      return 'Lunch only'
    case 'dinner_only':
      return 'Dinner only'
    default:
      return scope
  }
}

export default function MenuCard({ menu, onEdit, onPublish, onArchive }: MenuCardProps) {
  const theme = useTheme()

  const statusColor =
    menu.status === 'published'
      ? theme.palette.success.main
      : menu.status === 'archived'
      ? theme.palette.text.secondary
      : theme.palette.warning.main

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 3,
        borderColor: 'rgba(0,0,0,0.08)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
          <Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, mb: 0.5 }}
              className="truncate"
            >
              {menu.title || 'Untitled weekly menu'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {menu.duration_days}-day · {formatScope(menu.menu_scope)}
            </Typography>
          </Box>
          <Chip
            label={menu.status === 'draft' ? 'Draft' : menu.status === 'published' ? 'Published' : 'Archived'}
            size="small"
            sx={{
              fontWeight: 600,
              bgcolor: `${statusColor}20`,
              color: statusColor,
            }}
          />
        </Stack>

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="body2" color="text.secondary">
              Bundle price
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              ${Number(menu.base_price ?? 0).toFixed(2)}
            </Typography>
          </Box>
          <Box className="text-right">
            <Typography variant="body2" color="text.secondary">
              Required meals
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {menu.required_meal_count}
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={1.5} mt="auto">
          <EplateButton
            size="small"
            variantStyle="primary"
            onClick={onEdit}
            className="flex-1"
          >
            Edit
          </EplateButton>
          {menu.status === 'draft' && (
            <EplateButton
              size="small"
              variantStyle="secondary"
              onClick={onPublish}
            >
              Publish
            </EplateButton>
          )}
          {menu.status === 'published' && (
            <EplateButton
              size="small"
              variantStyle="ghost"
              onClick={onArchive}
            >
              Archive
            </EplateButton>
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}

