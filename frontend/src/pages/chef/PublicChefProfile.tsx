import { useParams } from "react-router-dom"
import { Container, Box } from "@mui/material"
import { usePublicChefProfile } from "../../hooks/useProfiles"
import LoadingState from "../../components/global/LoadingState"
import ChefPublicHero from '../../components/chef/ChefPublicHero'
import ChefBioBlock from '../../components/chef/ChefBioBlock'
import FeaturedMenuCard from '../../components/chef/menu/FeaturedMenuCard'
import MenuCardCarousel from '../../components/chef/menu/MenuCardCarousel'
import ChefIconsCarousel from "../../components/chef/cookingIconsCarousel"
import NotFound from "../../components/chef/NotFound"
import ChefReviewsPlaceholder from "../../components/chef/ChefReviewsPlaceholder"
import MenusPending from "../../components/chef/menu/MenusPending"


export default function PublicChefProfile() {
    const { slug } = useParams()
    const { data, isLoading } = usePublicChefProfile(slug ?? '')
    const chef = data?.chef
    const featuredMenu = data?.featured_menu
    const weeklyMenus = data?.weekly_menus
  
    if (isLoading) return <LoadingState carousel={<ChefIconsCarousel />}/>
  
    if (!chef) return <NotFound />
  
    return (
      <Container maxWidth="lg" sx={{pt: 4}}>
        <ChefPublicHero chef={chef} />
  
        <Box mt={4}>
          <ChefBioBlock bio={chef.bio} />
        </Box>

        {!weeklyMenus?.length && <MenusPending />}
  
        
        {featuredMenu && (
            <Box mt={6}>
            <FeaturedMenuCard menu={featuredMenu} />
          </Box>
        )}
  
        
        {weeklyMenus && (
            <Box mt={6}>
                <MenuCardCarousel menus={weeklyMenus} />
          </Box>
        )}
  
        <Box mt={8}>
          <ChefReviewsPlaceholder />
        </Box>
      </Container>
    )
  }