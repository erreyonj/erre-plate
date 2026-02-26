import { Box, Typography } from '@mui/material'
import EplateButton from '../../global/EplateButton'

interface EmptyStateProps {
  onCreateFirstMenu: () => void
}

export default function EmptyState({ onCreateFirstMenu }: EmptyStateProps) {
  return (
    <Box
      sx={{
        borderRadius: 3,
        border: '1px dashed rgba(0,0,0,0.16)',
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: 2,
        bgcolor: 'background.paper',
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: 700 }}>
        You don&apos;t have any menus yet
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 420 }}>
        Create your first weekly bundle so customers can start booking your menus.
        You&apos;ll be able to configure duration, meal coverage, and attach your signature dishes.
      </Typography>
      <EplateButton
        variantStyle="primary"
        onClick={onCreateFirstMenu}
        sx={{ mt: 1, px: 3 }}
      >
        Create Your First Menu
      </EplateButton>
    </Box>
  )
}

