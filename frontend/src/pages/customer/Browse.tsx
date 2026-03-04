import { Box, Typography, useTheme } from '@mui/material'
import BrowseHeader from '../../components/customer/browseHeader'
import { useSearchParams } from 'react-router-dom'
import { useBrowseFilters } from '../../hooks/useBrowseFilters'
import { useBrowseChefsQuery } from '../../hooks/useProfiles'
import EmptyChefGrid from '../../components/chef/EmptyChefGrid'
import ChefGrid from '../../components/chef/ChefGrid'
import type { ChefCard } from '../../types/user'
import LoadingState from '../../components/global/LoadingState'
import ChefCookingCarousel from '../../components/chef/cookingIconsCarousel'


export default function Browse() {
  const theme = useTheme()
  const mode = theme.palette.mode
  const { neighborhood, setNeighborhood } = useBrowseFilters()

  const { data, isLoading } = useBrowseChefsQuery(neighborhood)

  if (isLoading) {
    return (
      <LoadingState 
        carousel={<ChefCookingCarousel />}
        message="We're finding stellar chefs near you!..."
      />
    )
  }


  if(!neighborhood) {
    return <EmptyChefGrid hasNeighborhood={false} />
  }


  return (
    <>
      <BrowseHeader />

      <ChefGrid chefs={data ?? []} isLoading={isLoading} neighborhood={neighborhood} setNeighborhood={setNeighborhood} />

      {/* <Box className="flex justify-center items-center h-8 rounded-md mb-2" sx={{bgcolor: mode === 'light' ? "#e8e9e4" : theme.palette.background.paper}}>
        <Typography variant="body2" className="w-full text-center" sx={{color: theme.palette.text.primary}}>
          We&apos;re cooking up some stellar chefs for you!
        </Typography>
      </Box> */}
    </>
  )
}