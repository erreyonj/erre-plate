import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  usePublishWeeklyMenu,
  useUpdateWeeklyMenu,
  useWeeklyMenu,
} from './useMenus'
import { useChefDishes, useCreateDish } from './useDishes'
import type { Dish } from '../types/menu'
import type { MenuScope, WeeklyMenuDetail } from '../types/menu'
import { calculateRequiredMealCount } from '../types/menu'
import { getPublishErrors, getMealCounts, mapAssignedDishesToUi } from '../utils/menuBuilder'

type AssignedDishPayload = NonNullable<WeeklyMenuDetail['assigned_dishes']>[number]

function buildDraftFromMenu(menu: WeeklyMenuDetail) {
  return {
    title: menu.title ?? '',
    base_price: Number(menu.base_price ?? 0),
    duration_days: (menu.duration_days ?? 7) as 5 | 7,
    menu_scope: menu.menu_scope,
    assigned_dishes: [...(menu.assigned_dishes ?? [])],
  }
}

function buildSavePayload(draft: ReturnType<typeof buildDraftFromMenu>) {
  return {
    title: draft.title,
    base_price: draft.base_price,
    duration_days: draft.duration_days,
    menu_scope: draft.menu_scope,
    assigned_dishes: draft.assigned_dishes.map((item) => {
      const base = { dish_id: item.dish_id, meals_covered: item.meals_covered, meal_type: item.meal_type }
      return item.id != null && item.id > 0 ? { ...base, id: item.id } : base
    }),
  }
}

function isDirty(
  draft: ReturnType<typeof buildDraftFromMenu>,
  initial: ReturnType<typeof buildDraftFromMenu>
): boolean {
  return JSON.stringify(buildSavePayload(draft)) !== JSON.stringify(buildSavePayload(initial))
}

export function useMenuBuilder() {
  const navigate = useNavigate()
  const { menuId } = useParams<{ menuId: string }>()
  const { data: menu, isLoading, isError } = useWeeklyMenu(menuId)
  const updateMenu = useUpdateWeeklyMenu()
  const publishMenu = usePublishWeeklyMenu()
  const { data: dishes = [] } = useChefDishes()
  const createDish = useCreateDish()
  const [dishModalOpen, setDishModalOpen] = useState(false)
  const seededRef = useRef(false)

  const [draft, setDraft] = useState<ReturnType<typeof buildDraftFromMenu> | null>(null)
  const [initialDraft, setInitialDraft] = useState<ReturnType<typeof buildDraftFromMenu> | null>(null)

  useEffect(() => {
    if (menu && !seededRef.current) {
      const d = buildDraftFromMenu(menu)
      setDraft(d)
      setInitialDraft(d)
      seededRef.current = true
    }
  }, [menu])

  const dirty = draft && initialDraft ? isDirty(draft, initialDraft) : false

  const virtualMenu = useMemo((): WeeklyMenuDetail | undefined => {
    if (!menu || !draft) return undefined
    return {
      ...menu,
      title: draft.title,
      base_price: draft.base_price,
      duration_days: draft.duration_days,
      menu_scope: draft.menu_scope,
      assigned_dishes: draft.assigned_dishes,
      required_meal_count: calculateRequiredMealCount(draft.duration_days, draft.menu_scope),
    }
  }, [menu, draft])

  const assignedForUi = useMemo(() => mapAssignedDishesToUi(virtualMenu), [virtualMenu])
  const counts = useMemo(() => getMealCounts(virtualMenu), [virtualMenu])
  const publishErrors = useMemo(() => getPublishErrors(virtualMenu), [virtualMenu])

  const canPublish =
    !!virtualMenu &&
    publishErrors.length === 0 &&
    !!virtualMenu.required_meal_count &&
    (virtualMenu.assigned_dishes?.length ?? 0) > 0

  function handleBackToOverview() {
    navigate('/chef/dashboard')
  }

  function handleTitleChange(value: string) {
    setDraft((prev) => (prev ? { ...prev, title: value } : null))
  }

  function handleBasePriceChange(value: number) {
    setDraft((prev) => (prev ? { ...prev, base_price: value } : null))
  }

  function handleDurationChange(value: 5 | 7) {
    setDraft((prev) => (prev ? { ...prev, duration_days: value } : null))
  }

  function handleScopeChange(scope: MenuScope) {
    setDraft((prev) => (prev ? { ...prev, menu_scope: scope } : null))
  }

  function handleChangeMealsCovered(assignedId: string, mealsCovered: number) {
    setDraft((prev) => {
      if (!prev) return null
      return {
        ...prev,
        assigned_dishes: prev.assigned_dishes.map((item) =>
          String(item.id) === assignedId ? { ...item, meals_covered: mealsCovered } : item
        ),
      }
    })
  }

  function handleRemoveAssignedDish(assignedId: string) {
    setDraft((prev) => {
      if (!prev) return null
      return {
        ...prev,
        assigned_dishes: prev.assigned_dishes.filter((item) => String(item.id) !== assignedId),
      }
    })
  }

  function handleAssignDishToActive(dish: Dish) {
    const newItem: AssignedDishPayload = {
      id: -Date.now(),
      dish_id: Number(dish.id),
      meals_covered: 1,
      meal_type: dish.meal_type,
      dish: {
        id: Number(dish.id),
        name: dish.name,
        description: dish.description,
        meal_type: dish.meal_type,
        ingredients: dish.ingredients ?? [],
        dietary_tags: dish.dietary_tags ?? [],
      },
    }
    setDraft((prev) => {
      if (!prev) return null
      return {
        ...prev,
        assigned_dishes: [...prev.assigned_dishes, newItem],
      }
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

  function handleSave() {
    if (!menu || !draft) return
    updateMenu.mutate(
      { id: menu.id, payload: buildSavePayload(draft) as Partial<WeeklyMenuDetail> },
      {
        onSuccess: () => {
          setInitialDraft(draft)
        },
      }
    )
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

  return {
    menu,
    draft,
    dishes,
    isLoading,
    isError,
    isSaving: updateMenu.isPending,
    isPublishing: publishMenu.isPending,
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
  }
}
