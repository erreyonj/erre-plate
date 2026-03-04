import { useParams } from "react-router-dom"
import { Container, Box } from "@mui/material"
import { usePublicChefProfile } from "../../hooks/useProfiles"


export default function PublicChefProfile() {
    const { slug } = useParams()
    const { data: chef, isLoading } = usePublicChefProfile(slug)
  
    if (isLoading) return <LoadingState />
  
    if (!chef) return <NotFound />
  
    return (
      <Container maxWidth="lg">
        <ChefPublicHero chef={chef} />
  
        <Box mt={4}>
          <ChefBioBlock bio={chef.bio} />
        </Box>
  
        <Box mt={6}>
          <FeaturedMenuCard chefId={chef.id} />
        </Box>
  
        <Box mt={6}>
          <MenuCardCarousel chefId={chef.id} />
        </Box>
  
        <Box mt={8}>
          <ReviewSection chefId={chef.id} />
        </Box>
      </Container>
    )
  }