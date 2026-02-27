import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Box, CircularProgress, Stack, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import MenuConfigSection from '../../components/chef/menu/MenuConfigSection'
import AssignedDishCard from '../../components/chef/menu/AssignedDishCard'
import MenuCompletionIndicator from '../../components/chef/menu/MenuCompletionIndicator'
import PublishValidationAlert from '../../components/chef/menu/PublishValidationAlert'
import EplateButton from '../../components/global/EplateButton'
import DishModal from '../../components/chef/menu/DishModal'
import {
  usePublishWeeklyMenu,
  useUpdateWeeklyMenu,
  useWeeklyMenu,
} from '../../hooks/useMenus'
import type { WeeklyMenuDetail } from '../../types/menu'
import { useChefDishes, useCreateDish } from '../../hooks/useDishes'
import type { AssignedDish, Dish, Ingredient } from '../../types/menu'

function mapAssignedDishesToUi(menu: WeeklyMenuDetail | undefined): AssignedDish[] {
  if (!menu || !menu.assigned_dishes) return []

  return menu.assigned_dishes.map((item) => {
    const dish: Dish = {
      id: String(item.dish.id),
      name: item.dish.name,
      description: item.dish.description,
      meal_type: item.dish.meal_type,
      ingredients: (Array.isArray(item.dish.ingredients)
        ? item.dish.ingredients
        : []) as Ingredient[],
      dietary_tags: (Array.isArray(item.dish.dietary_tags)
        ? item.dish.dietary_tags
        : []) as string[],
    }

    return {
      id: String(item.id),
      dish,
      meals_covered: item.meals_covered,
      meal_type: item.meal_type,
    }
  })
}

function getMealCounts(menu: WeeklyMenuDetail | undefined) {
  if (!menu || !menu.assigned_dishes) {
    return { breakfast: 0, lunch: 0, dinner: 0, total: 0 }
  }

  let breakfast = 0
  let lunch = 0
  let dinner = 0

  menu.assigned_dishes.forEach((item) => {
    if (item.meal_type === 'breakfast') breakfast += item.meals_covered
    if (item.meal_type === 'lunch') lunch += item.meals_covered
    if (item.meal_type === 'dinner') dinner += item.meals_covered
  })

  return { breakfast, lunch, dinner, total: breakfast + lunch + dinner }
}

function getPublishErrors(menu: WeeklyMenuDetail | undefined) {
  if (!menu) return ['Menu could not be loaded.']

  const { breakfast, lunch, dinner, total } = getMealCounts(menu)
  const errors: string[] = []

  if (!menu.required_meal_count) {
    errors.push('Configure duration and scope to calculate required meal count.')
    return errors
  }

  if (total < menu.required_meal_count) {
    errors.push(
      `Assign ${menu.required_meal_count - total} more meal(s) to reach ${menu.required_meal_count} total.`,
    )
  } else if (total > menu.required_meal_count) {
    errors.push(
      `Reduce meals by ${total - menu.required_meal_count} to match the required total of ${menu.required_meal_count}.`,
    )
  }

  if (menu.menu_scope === 'full') {
    if (breakfast === 0) errors.push('Add at least one breakfast dish.')
    if (lunch === 0) errors.push('Add at least one lunch dish.')
    if (dinner === 0) errors.push('Add at least one dinner dish.')
  }

  if (menu.menu_scope === 'breakfast_only' && (lunch > 0 || dinner > 0)) {
    errors.push('Remove lunch and dinner dishes. This menu is breakfast-only.')
  }

  if (menu.menu_scope === 'lunch_only' && (breakfast > 0 || dinner > 0)) {
    errors.push('Remove breakfast and dinner dishes. This menu is lunch-only.')
  }

  if (menu.menu_scope === 'dinner_only' && (breakfast > 0 || lunch > 0)) {
    errors.push('Remove breakfast and lunch dishes. This menu is dinner-only.')
  }

  return errors
}

export default function MenuBuilder() {
  const theme = useTheme()
  const navigate = useNavigate()
  const { menuId } = useParams<{ menuId: string }>()
  const { data: menu, isLoading, isError } = useWeeklyMenu(menuId)
  const updateMenu = useUpdateWeeklyMenu()
  const publishMenu = usePublishWeeklyMenu()
  const { data: dishes = [] } = useChefDishes()
  const createDish = useCreateDish()
  const [dishModalOpen, setDishModalOpen] = useState(false)

  const assignedForUi = useMemo(
    () => mapAssignedDishesToUi(menu),
    [menu],
  )

  const counts = useMemo(() => getMealCounts(menu), [menu])
  const publishErrors = useMemo(() => getPublishErrors(menu), [menu])

  const canPublish =
    !!menu &&
    publishErrors.length === 0 &&
    !!menu.required_meal_count &&
    (menu.assigned_dishes?.length ?? 0) > 0

  function handleBackToOverview() {
    navigate('/chef/dashboard')
  }

  function handleTitleChange(value: string) {
    if (!menu) return
    updateMenu.mutate({ id: menu.id, payload: { title: value } })
  }

  function handleBasePriceChange(value: number) {
    if (!menu) return
    updateMenu.mutate({ id: menu.id, payload: { base_price: value } })
  }

  function handleDurationChange(value: 5 | 7) {
    if (!menu) return
    updateMenu.mutate({ id: menu.id, payload: { duration_days: value } })
  }

  function handleScopeChange(scope: WeeklyMenuDetail['menu_scope']) {
    if (!menu) return
    updateMenu.mutate({ id: menu.id, payload: { menu_scope: scope } })
  }

  function handleChangeMealsCovered(assignedId: string, mealsCovered: number) {
    if (!menu || !menu.assigned_dishes) return

    const updatedAssigned = menu.assigned_dishes.map((item) =>
      String(item.id) === assignedId ? { ...item, meals_covered: mealsCovered } : item,
    )

    updateMenu.mutate({
      id: menu.id,
      payload: { assigned_dishes: updatedAssigned },
    })
  }

  function handleRemoveAssignedDish(assignedId: string) {
    if (!menu || !menu.assigned_dishes) return

    const updatedAssigned = menu.assigned_dishes.filter(
      (item) => String(item.id) !== assignedId,
    )

    updateMenu.mutate({
      id: menu.id,
      payload: { assigned_dishes: updatedAssigned },
    })
  }

  function handleAssignDishToActive(dish: Dish) {
    if (!menu) return

    const existing = menu.assigned_dishes ?? []

    const payloadAssigned = existing.map((item) => ({
      id: item.id,
      dish_id: item.dish_id,
      meals_covered: item.meals_covered,
      meal_type: item.meal_type,
    }))

    payloadAssigned.push({
      dish_id: Number(dish.id),
      meals_covered: 1,
      meal_type: dish.meal_type,
    } as any)

    updateMenu.mutate({
      id: menu.id,
      payload: { assigned_dishes: payloadAssigned as any },
    })
  }

  async function handleCreateDish(payload: Omit<Dish, 'id'>) {
    try {
      const created = await createDish.mutateAsync(payload)
      handleAssignDishToActive(created)
      setDishModalOpen(false)
    } catch {
      // handled by toasts later
    }
  }

  async function handlePublish() {
    if (!menu || !canPublish) return
    try {
      await publishMenu.mutateAsync(menu.id)
      navigate('/chef/dashboard')
    } catch {
      // handled by future toast system
    }
  }

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
            title={menu.title}
            basePrice={Number(menu.base_price ?? 0)}
            durationDays={menu.duration_days as 5 | 7}
            scope={menu.menu_scope}
            requiredMealCount={menu.required_meal_count ?? 0}
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
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Assigned dishes
            </Typography>

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
            durationDays={menu.duration_days as 5 | 7}
            scope={menu.menu_scope}
            requiredTotal={menu.required_meal_count ?? 0}
            breakfastCount={counts.breakfast}
            lunchCount={counts.lunch}
            dinnerCount={counts.dinner}
            isValid={canPublish}
          />
          <PublishValidationAlert errors={publishErrors} />
          <EplateButton
            fullWidth
            variantStyle="secondary"
            disabled={!canPublish || publishMenu.isPending}
            onClick={handlePublish}
          >
            {publishMenu.isPending ? 'Publishing…' : 'Publish menu'}
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

