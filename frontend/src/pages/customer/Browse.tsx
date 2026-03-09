
import { useBrowseFilters } from '../../hooks/useBrowseFilters'
import { useBrowseChefsQuery } from '../../hooks/useProfiles';
import ChefGrid from '../../components/chef/ChefGrid';
import LoadingState from '../../components/global/LoadingState';
import ChefCookingCarousel from '../../components/chef/cookingIconsCarousel';
import BrowseHeader from '../../components/customer/browseHeader';


export default function Browse() {
  const { filters, setNeighborhood } = useBrowseFilters()

  const { data, isLoading } = useBrowseChefsQuery(filters)
  const neighborhood = filters.neighborhood

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