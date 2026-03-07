import { Box, Typography, useTheme } from '@mui/material'
import BrowseHeader from '../../components/customer/browseHeader'
import { useNavigate, useSearchParams } from 'react-router-dom'
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
  const navigate = useNavigate()
  const { filters, setNeighborhood } = useBrowseFilters()

  const { data, isLoading } = useBrowseChefsQuery(filters)
  const neighborhood = filters.neighborhood

  console.log(filters);
  

  if (isLoading) {
    return (
      <LoadingState 
        carousel={<ChefCookingCarousel />}
        message="We're finding stellar chefs near you!..."
      />
    )
  }


  // if(!neighborhood) {
  //   return <EmptyChefGrid hasNeighborhood={false} onBrowseAll={() => setNeighborhood('all')} onUpdateProfile={() => navigate('/customer/profile/edit')}/>
  // }


  return (
    <>
      <BrowseHeader />
      <ChefGrid chefs={data ?? []} isLoading={isLoading} neighborhood={neighborhood} setNeighborhood={setNeighborhood} />
    </>
  )
}