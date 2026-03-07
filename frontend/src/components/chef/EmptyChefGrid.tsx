import { Box, Typography, useTheme } from '@mui/material'
import EplateButton from '../global/EplateButton'

interface EmptyChefGridProps {
  hasNeighborhood: boolean
  onBrowseAll?: () => void
  onUpdateProfile?: () => void
}

export default function EmptyChefGrid({
  hasNeighborhood,
  onBrowseAll,
  onUpdateProfile,
}: EmptyChefGridProps) {
  const theme = useTheme()

  return (
    <Box
      sx={{
        borderRadius: 4,
        border: `1px dashed ${theme.palette.secondary.main}`,
        p: 5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: 2,
        bgcolor: theme.palette.background.paper,
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          color: theme.palette.secondary.main,
        }}
      >
        We&apos;re cooking up something special
      </Typography>

      <Typography
        variant="body2"
        sx={{
          maxWidth: 480,
          color: theme.palette.text.secondary,
        }}
      >
        We weren't able to find any chefs for you right now, but we're always actively onboarding new talent!
      </Typography>

      {/* Conditional CTAs */}
      {/* {hasNeighborhood ? (
        onBrowseAll && (
          <EplateButton
            variantStyle="secondary"
            onClick={onBrowseAll}
            sx={{ mt: 2, px: 4 }}
          >
            Browse All Chefs
          </EplateButton>
        )
      ) : (
        onUpdateProfile && (
          <EplateButton
            variantStyle="secondary"
            onClick={onUpdateProfile}
            sx={{ mt: 2, px: 4 }}
          >
            Add Your Neighborhood
          </EplateButton>
        )
      )} */}
      <EplateButton
        variantStyle="secondary"
        onClick={onBrowseAll}
        sx={{ mt: 2, px: 4 }}
      >
        Browse All Chefs
      </EplateButton>
    </Box>
  )
}