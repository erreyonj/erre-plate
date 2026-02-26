import {
  Box,
  TextField,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material'
import type { MenuScope } from '../../../types/menu'

interface MenuConfigSectionProps {
  title: string
  basePrice: number
  durationDays: 5 | 7
  scope: MenuScope
  requiredMealCount: number
  onTitleChange: (value: string) => void
  onBasePriceChange: (value: number) => void
  onDurationChange: (value: 5 | 7) => void
  onScopeChange: (value: MenuScope) => void
}

export default function MenuConfigSection({
  title,
  basePrice,
  durationDays,
  scope,
  requiredMealCount,
  onTitleChange,
  onBasePriceChange,
  onDurationChange,
  onScopeChange,
}: MenuConfigSectionProps) {
  return (
    <Box
      sx={{
        borderRadius: 3,
        border: '1px solid rgba(0,0,0,0.08)',
        p: 3,
        bgcolor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        gap: 2.5,
      }}
    >
      <Box className="space-y-1">
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Weekly menu settings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Configure the basics for this bundle. You&apos;ll attach dishes below.
        </Typography>
      </Box>

      <Box className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <TextField
          label="Menu title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          fullWidth
          size="small"
          placeholder="e.g. Busy Weeknight Comforts"
        />
        <TextField
          label="Base price (bundle)"
          type="number"
          value={Number.isNaN(basePrice) ? '' : basePrice}
          onChange={(e) => onBasePriceChange(Number(e.target.value) || 0)}
          fullWidth
          size="small"
          InputProps={{ startAdornment: <span className="mr-1">$</span> }}
        />
      </Box>

      <Box className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Duration
          </Typography>
          <ToggleButtonGroup
            exclusive
            size="small"
            value={durationDays}
            onChange={(_, value: 5 | 7 | null) => {
              if (value) {
                onDurationChange(value)
              }
            }}
          >
            <ToggleButton value={5}>5 days</ToggleButton>
            <ToggleButton value={7}>7 days</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Menu scope
          </Typography>
          <ToggleButtonGroup
            exclusive
            size="small"
            value={scope}
            onChange={(_, value: MenuScope | null) => {
              if (value) {
                onScopeChange(value)
              }
            }}
          >
            <ToggleButton value="full">Full (B+L+D)</ToggleButton>
            <ToggleButton value="breakfast_only">Breakfast only</ToggleButton>
            <ToggleButton value="lunch_only">Lunch only</ToggleButton>
            <ToggleButton value="dinner_only">Dinner only</ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>

      <Box className="rounded-xl bg-eplate-cream/40 px-3 py-2">
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          You must assign {requiredMealCount} total meals to publish this menu.
        </Typography>
      </Box>
    </Box>
  )
}

