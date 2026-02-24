import { useMemo, useState } from 'react'
import {
  AppBar,
  Box,
  BottomNavigation,
  BottomNavigationAction,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Toolbar,
  Typography,
  useMediaQuery,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import MenuIcon from '@mui/icons-material/Menu'
import SearchIcon from '@mui/icons-material/Search'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import HomeIcon from '@mui/icons-material/Home'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'

function MobileBrowseLayout({ children }: { children: React.ReactNode }) {
  const theme = useTheme()
  const [nav, setNav] = useState<'home' | 'orders' | 'profile'>('home')


  return (
    <Box sx={{ minHeight: '100vh', width: '100%', bgcolor: '#fff' }}>
      <AppBar
        position="sticky"
        elevation={2}
        sx={{
          bgcolor: '#fff',
          color: theme.palette.text.primary,
          borderBottom: '1px solid',
          borderColor: 'rgba(0,0,0,0.08)',
        }}
      >
        <Toolbar sx={{ minHeight: 64, display: 'flex', justifyContent: 'space-between' }}>
          <Typography
            component="div"
            sx={{
              fontWeight: 900,
              fontSize: 24,
              letterSpacing: 1,
              textTransform: 'lowercase',
              color: '#000',
            }}
          >
            airplate
          </Typography>
          <IconButton aria-label="Open menu" edge="end" sx={{ color: '#000' }}>
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box sx={{ px: 2, pt: 2, pb: 14 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
            <Typography
              sx={{
                fontSize: 18,
                color: '#000',
                textDecoration: 'underline',
                textUnderlineOffset: '6px',
              }}
            >
              My Credits:
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5 }}>
              <Box
                sx={{
                  mt: 0.35,
                  width: 18,
                  height: 18,
                  borderRadius: 999,
                  bgcolor: theme.palette.success.main,
                  color: '#fff',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: 12,
                  lineHeight: 1,
                  fontWeight: 700,
                }}
              >
                $
              </Box>
              <Typography sx={{ fontSize: 34, fontWeight: 800, color: '#000', lineHeight: 1 }}>
                19
              </Typography>
            </Box>
          </Box>

          <TextField
            fullWidth
            size="small"
            placeholder="Search"
            aria-label="Search chefs"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon sx={{ color: 'rgba(0,0,0,0.5)' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 999,
                bgcolor: 'rgba(0,0,0,0.08)',
                '& fieldset': { borderColor: 'transparent' },
                '&:hover fieldset': { borderColor: 'transparent' },
                '&.Mui-focused fieldset': { borderColor: 'transparent' },
              },
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <IconButton
            aria-label="Filter"
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2,
              bgcolor: 'rgba(0,0,0,0.06)',
              color: theme.palette.text.primary,
            }}
          >
            <FilterAltIcon />
          </IconButton>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <LocationOnIcon sx={{ color: theme.palette.success.dark }} fontSize="small" />
            <Typography sx={{ color: '#000', fontSize: 16 }}>
              Browse{' '}
              <Box component="span" sx={{ color: theme.palette.warning.main, fontWeight: 700 }}>
                Madison
              </Box>{' '}
              Chefs:
            </Typography>
          </Box>
        </Box>


        {/* PAGE CONTENT */}
        <Box className="flex justify-center items-center h-8 bg-eplate-cream rounded-md">
          <Typography variant='body2' className='w-full text-center'> We're cooking up some stellar chefs for you! </Typography>
        </Box>

        {children}

        {/* <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 1.5,
          }}
        >
          {chefs.map((chef) => (
            <BrowseCard key={chef.id} chef={chef} />
          ))}

        </Box> */}
      </Box>

      <Paper
        elevation={6}
        sx={{
          position: 'fixed',
          left: 16,
          right: 16,
          bottom: 16,
          borderRadius: 999,
          bgcolor: theme.palette.success.dark,
          overflow: 'hidden',
        }}
      >
        <BottomNavigation
          value={nav}
          onChange={(_, v) => setNav(v)}
          showLabels={false}
          sx={{
            height: 64,
            bgcolor: 'transparent',
            '& .MuiBottomNavigationAction-root': {
              minWidth: 0,
              color: 'rgba(255,255,255,0.9)',
            },
            '& .Mui-selected': {
              color: '#fff',
            },
          }}
        >
          <BottomNavigationAction value="home" icon={<HomeIcon />} aria-label="Home" />
          <BottomNavigationAction value="orders" icon={<ReceiptLongIcon />} aria-label="Orders" />
          <BottomNavigationAction value="profile" icon={<PersonOutlineIcon />} aria-label="Profile" />
        </BottomNavigation>
      </Paper>
    </Box>
  )
}

export default function Responsive({ children }: { children: React.ReactNode }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'))

  if (isMobile) return <MobileBrowseLayout>{children}</MobileBrowseLayout>
  if (isTablet) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', p: 3 }}>
        <Typography variant="h5">Tablet layout placeholder</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', p: 3 }}>
      <Typography variant="h5">Desktop layout placeholder</Typography>
    </Box>
  )
}