import { Box, CircularProgress, Stack, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useNavigate } from 'react-router-dom'
import EplateButton from '../../components/global/EplateButton'
import MenuCard from '../../components/chef/menu/MenuCard'
import EmptyState from '../../components/chef/menu/EmptyState'
import { useChefMenus, useCreateWeeklyMenu } from '../../hooks/menus'

export default function Menus() {
  const theme = useTheme()
  const navigate = useNavigate()
  const { data: menus, isLoading, isError } = useChefMenus()
  const createMenu = useCreateWeeklyMenu()

  const sortedMenus = menus
    ? [...menus].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )
    : []
  const topThree = sortedMenus.slice(0, 3)

  async function handleCreateMenu() {
    try {
      const menu = await createMenu.mutateAsync({})
      navigate(`/chef/menus/${menu.id}/edit`)
    } catch {
      // handled by global error handlers / toasts later
    }
  }

  function handleViewAll() {
    navigate('/chef/menus/all')
  }

  function handleEditMenu(id: number) {
    navigate(`/chef/menus/${id}/edit`)
  }

  return (
    <Box className="space-y-4">
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Weekly menus
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create and manage the bundles customers can purchase from you.
          </Typography>
        </Box>
        <EplateButton
          variantStyle="primary"
          onClick={handleCreateMenu}
          sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
        >
          Create New Menu
        </EplateButton>
      </Stack>

      {isLoading && (
        <Box className="flex items-center justify-center py-10">
          <CircularProgress />
        </Box>
      )}

      {isError && !isLoading && (
        <Box
          sx={{
            borderRadius: 3,
            border: '1px solid rgba(0,0,0,0.08)',
            p: 3,
            bgcolor: theme.palette.background.paper,
          }}
        >
          <Typography variant="body2" color="error">
            We couldn&apos;t load your menus right now. Please try again in a moment.
          </Typography>
        </Box>
      )}

      {!isLoading && !isError && menus && menus.length === 0 && (
        <EmptyState onCreateFirstMenu={handleCreateMenu} />
      )}

      {!isLoading && !isError && menus && menus.length > 0 && (
        <Box className="space-y-4">
          <Box className="flex items-center justify-between mb-2">
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Recent weekly menus
            </Typography>
            <EplateButton variantStyle="ghost" size="small" onClick={handleViewAll}>
              View All
            </EplateButton>
          </Box>
          <Box className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {topThree.map((menu) => (
              <Box key={menu.id}>
                <MenuCard
                  menu={menu}
                  onEdit={() => handleEditMenu(menu.id)}
                  onPublish={() => handleEditMenu(menu.id)}
                  onArchive={() => handleEditMenu(menu.id)}
                />
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  )
}
