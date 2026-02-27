import { useMemo, useState } from 'react'
import { Box, CircularProgress, MenuItem, Stack, TextField, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useNavigate } from 'react-router-dom'
import MenuCard from '../../components/chef/menu/MenuCard'
import EplateButton from '../../components/global/EplateButton'
import { useChefMenus } from '../../hooks/useMenus'
import type { MenuStatus } from '../../types/menu'

const PAGE_SIZE = 10

export default function AllMenus() {
  const theme = useTheme()
  const navigate = useNavigate()
  const { data: menus, isLoading, isError } = useChefMenus()
  const [statusFilter, setStatusFilter] = useState<MenuStatus | 'all'>('all')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    if (!menus) return []
    const sorted = [...menus].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
    if (statusFilter === 'all') return sorted
    return sorted.filter((m) => m.status === statusFilter)
  }, [menus, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const startIndex = (currentPage - 1) * PAGE_SIZE
  const pageItems = filtered.slice(startIndex, startIndex + PAGE_SIZE)

  function handleEditMenu(id: number) {
    navigate(`/chef/menus/${id}/edit`)
  }

  function handleBack() {
    navigate('/chef/dashboard')
  }

  return (
    <Box className="space-y-4">
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            All weekly menus
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Review every weekly bundle you&apos;ve created.
          </Typography>
        </Box>
        <EplateButton variantStyle="ghost" size="small" onClick={handleBack}>
          Back to overview
        </EplateButton>
      </Stack>

      <Stack direction="row" spacing={2} alignItems="center">
        <TextField
          select
          size="small"
          label="Status"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value as MenuStatus | 'all')
            setPage(1)
          }}
          sx={{ width: 180 }}
        >
          <MenuItem value="all">All statuses</MenuItem>
          <MenuItem value="draft">Draft</MenuItem>
          <MenuItem value="published">Published</MenuItem>
          <MenuItem value="archived">Archived</MenuItem>
        </TextField>
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
        <Typography variant="body2" color="text.secondary">
          You haven&apos;t created any weekly menus yet.
        </Typography>
      )}

      {!isLoading && !isError && pageItems.length > 0 && (
        <Box className="space-y-4">
          <Box className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {pageItems.map((menu) => (
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

          {totalPages > 1 && (
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" color="text.secondary">
                Page {currentPage} of {totalPages}
              </Typography>
              <Stack direction="row" spacing={1}>
                <EplateButton
                  variantStyle="ghost"
                  size="small"
                  disabled={currentPage === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </EplateButton>
                <EplateButton
                  variantStyle="ghost"
                  size="small"
                  disabled={currentPage === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                </EplateButton>
              </Stack>
            </Stack>
          )}
        </Box>
      )}
    </Box>
  )
}

