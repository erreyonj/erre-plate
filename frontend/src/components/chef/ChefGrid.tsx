import { Box, Grid, Typography } from '@mui/material'
import BrowseCard from './browseCard'
import type { PublicChefProfile } from '../../types/profile'
import EmptyChefGrid from './EmptyChefGrid'
import { useNavigate } from 'react-router-dom'

type ChefGridProps = {
  chefs: PublicChefProfile[]
  isLoading: boolean,
  emptyMessage?: string,
  neighborhood?: number | null,
  setNeighborhood: (id: number | 'all') => void
}

export default function ChefGrid({
  chefs,
  neighborhood,
  setNeighborhood
}: ChefGridProps) {
    const navigate = useNavigate()


  if (!chefs || chefs.length === 0) {
    return (
        <EmptyChefGrid 
            hasNeighborhood={!!neighborhood} 
            onBrowseAll={() => setNeighborhood('all')}
            onUpdateProfile={() => navigate('/customer/profile/edit')}
        />
    )
  }

  return (
    <Box className={`h-full`}>
        <Grid container spacing={3} className={`pt-4 justify-center`}>
        {chefs.map((chef) => (
            <Grid key={chef.id} className={`last:mb-36`}>
                <BrowseCard chef={chef} />
            </Grid>
        ))}
        </Grid>
    </Box>
  )
}