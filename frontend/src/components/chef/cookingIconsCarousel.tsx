// components/ui/ChefCookingCarousel.tsx
import { useTheme } from '@mui/material/styles'
import SoupKitchenIcon from '@mui/icons-material/SoupKitchen'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import LocalDiningIcon from '@mui/icons-material/LocalDining'
import BakeryDiningIcon from '@mui/icons-material/BakeryDining'
import RamenDiningIcon from '@mui/icons-material/RamenDining'
import IconCarousel from '../global/iconCarousel'


export default function ChefCookingCarousel() {
  const theme = useTheme()

  const iconStyle = {
    fontSize: 40,
    color: theme.palette.text.primary,
  }

  const slides = [
    <SoupKitchenIcon sx={iconStyle} />,
    <RestaurantIcon sx={iconStyle} />,
    <LocalDiningIcon sx={iconStyle} />,
    <BakeryDiningIcon sx={iconStyle} />,
    <RamenDiningIcon sx={iconStyle} />,
  ]

  return <IconCarousel slides={slides} />
}