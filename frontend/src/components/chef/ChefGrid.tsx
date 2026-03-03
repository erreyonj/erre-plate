import { Box, Grid, Typography } from '@mui/material'
import type { ChefCard } from '../../types/user'
import BrowseCard from './browseCard'
import type { ChefProfile } from '../../types/profile'
import EmptyChefGrid from './EmptyChefGrid'

type ChefGridProps = {
  chefs: ChefProfile[]
  isLoading: boolean,
  emptyMessage?: string
}

export default function ChefGrid({
  chefs,
}: ChefGridProps) {
  if (!chefs || chefs.length === 0) {
    return (
        <EmptyChefGrid hasNeighborhood={true} />
    )
  }

  return (
    <Grid container spacing={2}>
      {chefs.map((chef) => (
        <Grid xs={12} sm={6} md={4} lg={3} key={chef.id}>
          <BrowseCard chef={chef} />
        </Grid>
      ))}
    </Grid>
  )
}