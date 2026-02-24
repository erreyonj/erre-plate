import { Box, Typography, useTheme } from '@mui/material'
import BrowseHeader from '../../components/customer/browseHeader'


export default function Browse() {
  const theme = useTheme()
  const mode = theme.palette.mode
  return (
    <>
      <BrowseHeader />

      <Box className="flex justify-center items-center h-8 rounded-md mb-2" sx={{bgcolor: mode === 'light' ? "#e8e9e4" : theme.palette.background.paper}}>
        <Typography variant="body2" className="w-full text-center" sx={{color: theme.palette.text.primary}}>
          We&apos;re cooking up some stellar chefs for you!
        </Typography>
      </Box>
    </>
  )
}