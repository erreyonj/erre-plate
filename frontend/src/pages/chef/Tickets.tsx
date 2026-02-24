import { Box, Typography } from '@mui/material'

export default function Tickets() {
  return (
    <Box className="flex justify-center items-center h-8 bg-eplate-cream rounded-md mb-2">
      <Typography variant="body2" className="w-full text-center">
        No Tickets yet!
      </Typography>
    </Box>
  )
}