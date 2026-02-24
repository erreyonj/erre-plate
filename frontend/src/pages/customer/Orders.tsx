import { Box, Typography, useTheme } from '@mui/material'

export default function Orders() {
    const theme = useTheme()
  return (
    <Box className="flex justify-center items-center h-8 rounded-md mb-2" sx={{bgcolor: theme.palette.background.paper}}>
      <Typography variant="body2" className="w-full text-center" sx={{color: theme.palette.text.primary}}>
        No Orders yet!
      </Typography>
    </Box>
  )
}