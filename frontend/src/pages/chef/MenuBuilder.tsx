import { Box, CircularProgress, Stack, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import MenuConfigSection from '../../components/chef/menu/MenuConfigSection'
import AssignedDishCard from '../../components/chef/menu/AssignedDishCard'
import MenuCompletionIndicator from '../../components/chef/menu/MenuCompletionIndicator'
import PublishValidationAlert from '../../components/chef/menu/PublishValidationAlert'
import EplateButton from '../../components/global/EplateButton'
import DishModal from '../../components/chef/menu/DishModal'
import { useMenuBuilder } from '../../hooks/useMenuBuilder'
import { calculateRequiredMealCount } from '../../types/menu'

export default function MenuBuilder() {
  const theme = useTheme()
  const {
    menu,
    draft,
    dishes,
    isLoading,
    isError,
    isSaving,
    isPublishing,
    assignedForUi,
    counts,
    publishErrors,
    canPublish,
    dirty,
    dishModalOpen,
    setDishModalOpen,
    handleBackToOverview,
    handleTitleChange,
    handleBasePriceChange,
    handleDurationChange,
    handleScopeChange,
    handleChangeMealsCovered,
    handleRemoveAssignedDish,
    handleAssignDishToActive,
    handleCreateDish,
    handleSave,
    handlePublish,
  } = useMenuBuilder()

  if (isLoading) {
    return (
      <Box className="flex items-center justify-center py-10">
        <CircularProgress />
      </Box>
    )
  }

  if (isError || !menu) {
    return (
      <Box
        sx={{
          borderRadius: 3,
          border: '1px solid rgba(0,0,0,0.08)',
          p: 3,
          bgcolor: theme.palette.background.paper,
        }}
      >
        <Typography variant="body2" color="error">
          We couldn&apos;t load this menu. It may have been removed or you don&apos;t have
          access.
        </Typography>
        <EplateButton
          sx={{ mt: 2 }}
          variantStyle="ghost"
          onClick={handleBackToOverview}
        >
          Back to menus
        </EplateButton>
      </Box>
    )
  }

  if (!draft) {
    return (
      <Box className="flex items-center justify-center py-10">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box className="space-y-4">
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Edit weekly menu
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Configure duration, scope, and assigned dishes before publishing.
          </Typography>
        </Box>
        <EplateButton variantStyle="ghost" size="small" onClick={handleBackToOverview}>
          Back to menus
        </EplateButton>
      </Stack>

      <Box className="grid grid-cols-1 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-4">
        <Box className="space-y-3">
          <MenuConfigSection
            title={draft.title}
            basePrice={draft.base_price}
            durationDays={draft.duration_days}
            scope={draft.menu_scope}
            requiredMealCount={calculateRequiredMealCount(draft.duration_days, draft.menu_scope)}
            onTitleChange={handleTitleChange}
            onBasePriceChange={handleBasePriceChange}
            onDurationChange={handleDurationChange}
            onScopeChange={handleScopeChange}
          />

          <Box
            sx={{
              borderRadius: 3,
              border: '1px solid rgba(0,0,0,0.08)',
              p: 3,
              bgcolor: theme.palette.background.paper,
            }}
            className="space-y-3"
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Assigned dishes
              </Typography>
              <EplateButton
                size="small"
                variantStyle="ghost"
                onClick={() => setDishModalOpen(true)}
              >
                Add dish
              </EplateButton>
            </Stack>

            {assignedForUi.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No dishes assigned yet. Attach dishes from your library in a future step.
              </Typography>
            ) : (
              <Box className="space-y-2">
                {assignedForUi.map((assigned) => (
                  <AssignedDishCard
                    key={assigned.id}
                    assignedDish={assigned}
                    onChangeMealsCovered={(value) =>
                      handleChangeMealsCovered(assigned.id, value)
                    }
                    onRemove={() => handleRemoveAssignedDish(assigned.id)}
                  />
                ))}
              </Box>
            )}
          </Box>
        </Box>

        <Box className="space-y-3">
          <MenuCompletionIndicator
            durationDays={draft.duration_days}
            scope={draft.menu_scope}
            requiredTotal={calculateRequiredMealCount(draft.duration_days, draft.menu_scope)}
            breakfastCount={counts.breakfast}
            lunchCount={counts.lunch}
            dinnerCount={counts.dinner}
            isValid={canPublish}
          />
          <PublishValidationAlert errors={publishErrors} />
          <EplateButton
            variantStyle="secondary"
            disabled={!dirty || isSaving}
            onClick={handleSave}
            sx={{
              animation: 'bounce 1.5s infinite',
              '@keyframes bounce': {
                '0%': {
                  transform: 'translateY(0)',
                },
                '50%': {
                  transform: 'translateY(-10px)',
                },
              },
              '100%': {
                transform: 'translateY(0)',
              },
              position: 'absolute',
              bottom: 170,
              right: 20,
              px: 2,
              py: 1.5,
              boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
            }}
          >
            {isSaving ? 'Saving…' : 'Save changes'}
          </EplateButton>
          <EplateButton
            fullWidth
            variantStyle="secondary"
            disabled={!canPublish || isPublishing}
            onClick={handlePublish}
          >
            {isPublishing ? 'Publishing…' : 'Publish menu'}
          </EplateButton>
        </Box>
      </Box>

      <DishModal
        open={dishModalOpen}
        dishes={dishes}
        onClose={() => setDishModalOpen(false)}
        onSelectDish={(dish) => {
          handleAssignDishToActive(dish)
          setDishModalOpen(false)
        }}
        onCreateDish={handleCreateDish}
      />
    </Box>
  )
}
