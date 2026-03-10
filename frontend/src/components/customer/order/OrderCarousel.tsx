import { useCallback, useMemo, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { Box } from '@mui/material'
import OrderSlide1Scope from './OrderSlide1Scope'
import OrderSlide2List from './OrderSlide2List'
import OrderSlide3Details from './OrderSlide3Details'
import type { MenuScope, WeeklyMenuSummary } from '../../../types/menu'
import type { PublicChefProfile } from '../../../types/profile'
import type { ScopeCounts } from '../../../pages/customer/OrderBuilder'

type ActiveScope = MenuScope | 'all'

interface OrderCarouselProps {
  chef: PublicChefProfile
  chefName: string
  allMenus: WeeklyMenuSummary[]
  scopeCounts: ScopeCounts
  slug: string
}

export default function OrderCarousel({
  chef,
  chefName,
  allMenus,
  scopeCounts,
  slug,
}: OrderCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    watchDrag: false, // prevent swipe — navigation is programmatic only
  })

  const [activeScope, setActiveScope] = useState<ActiveScope>('all')
  const [selectedMenuId, setSelectedMenuId] = useState<number | null>(null)

  const goTo = useCallback(
    (index: number) => {
      emblaApi?.scrollTo(index)
    },
    [emblaApi]
  )

  const goNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])
  const goPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])

  // Filter menus by active scope
  const filteredMenus = useMemo(() => {
    if (activeScope === 'all') return allMenus
    return allMenus.filter((m) => m.menu_scope === activeScope)
  }, [allMenus, activeScope])

  const handleScopeSelect = useCallback(
    (scope: ActiveScope) => {
      setActiveScope(scope)
      setSelectedMenuId(null)
      goTo(1)
    },
    [goTo]
  )

  const handleScopeSwitch = useCallback(
    (scope: ActiveScope) => {
      setActiveScope(scope)
      setSelectedMenuId(null)
    },
    []
  )

  const handleMenuSelect = useCallback(
    (menuId: number) => {
      setSelectedMenuId(menuId)
      goTo(2)
    },
    [goTo]
  )

  const handleBackToList = useCallback(() => {
    setSelectedMenuId(null)
    goTo(1)
  }, [goTo])

  const handleBackToScope = useCallback(() => {
    goTo(0)
  }, [goTo])

  return (
    <Box ref={emblaRef} sx={{ overflow: 'hidden', width: '100%' }}>
      <Box sx={{ display: 'flex' }}>
        {/* Slide 1 — Scope Selection */}
        <Box sx={{ flex: '0 0 100%', minWidth: 0 }}>
          <OrderSlide1Scope
            chefName={chefName}
            scopeCounts={scopeCounts}
            onScopeSelect={handleScopeSelect}
            slug={slug}
          />
        </Box>

        {/* Slide 2 — Menu List */}
        <Box sx={{ flex: '0 0 100%', minWidth: 0 }}>
          <OrderSlide2List
            activeScope={activeScope}
            scopeCounts={scopeCounts}
            menus={filteredMenus}
            onScopeSwitch={handleScopeSwitch}
            onMenuSelect={handleMenuSelect}
            onBack={handleBackToScope}
          />
        </Box>

        {/* Slide 3 — Menu Details */}
        <Box sx={{ flex: '0 0 100%', minWidth: 0 }}>
          <OrderSlide3Details
            menuId={selectedMenuId}
            chefName={chefName}
            onBack={handleBackToList}
          />
        </Box>
      </Box>
    </Box>
  )
}
