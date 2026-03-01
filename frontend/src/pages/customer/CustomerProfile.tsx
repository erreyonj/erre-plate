import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  Stack,
  Typography,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu'
import LocalDiningIcon from '@mui/icons-material/LocalDining'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { useNavigate } from 'react-router-dom'
import type { User } from '../../types/user'
import { useAuth } from '../../contexts/AuthContext'

function getDisplayName(user: User | null | undefined) {
  if (!user) return 'Guest'
  if (user.name) return user.name
  return `${user.first_name} ${user.last_name}`.trim()
}

export default function CustomerProfile() {
  const theme = useTheme()
  const { user } = useAuth()
  const navigate = useNavigate()

  const displayName = getDisplayName(user)

  // Placeholder stats until wired to real data
  const savedChefs = 0
  const totalMealsPrepped = 0
  const hasDietaryPreferences = false

  const hasRecentOrder = false

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Header row with title + notification bell */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 0.5,
        }}
      >
        <Box>
          <Typography variant="subtitle2" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
            Profile
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            Hey, {displayName}
          </Typography>
        </Box>
        <IconButton
          aria-label="Notifications"
          sx={{
            borderRadius: 999,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: theme.palette.background.paper,
          }}
        >
          <NotificationsNoneIcon />
        </IconButton>
      </Box>

      {/* Hero card */}
      <Card
        variant="outlined"
        sx={{
          borderRadius: 3,
          borderColor: 'rgba(0,0,0,0.08)',
          overflow: 'hidden',
        }}
      >
        <CardContent
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Avatar
            src={user?.photo_url || ''}
            sx={{
              width: 72,
              height: 72,
              bgcolor: theme.palette.primary.main,
              fontWeight: 800,
              fontSize: 28,
            }}
          >
            {displayName.charAt(0).toUpperCase()}
          </Avatar>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 800 }}
              noWrap
            >
              {displayName}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: 'text.secondary' }}
              noWrap
            >
              {user?.email ?? 'you@example.com'}
            </Typography>
            {user?.phone && (
              <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                {user.phone}
              </Typography>
            )}
            {typeof user?.credit_balance === 'number' && (
              <Chip
                size="small"
                label={`${user.credit_balance} credits`}
                sx={{
                  mt: 0.75,
                  fontWeight: 700,
                  borderRadius: 999,
                  bgcolor: theme.palette.primary.light,
                  color: theme.palette.primary.contrastText,
                }}
              />
            )}
          </Box>

          <Button
            variant="outlined"
            size="small"
            onClick={() => navigate('/customer/profile/edit')}
            sx={{
              borderRadius: 999,
              textTransform: 'none',
              fontWeight: 700,
              whiteSpace: 'nowrap',
            }}
          >
            Edit profile
          </Button>
        </CardContent>
      </Card>

      {/* Quick stat bar */}
      <Card
        variant="outlined"
        sx={{
          borderRadius: 3,
          borderColor: 'rgba(0,0,0,0.08)',
        }}
      >
        <CardContent sx={{ py: 1.5 }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={1}
          >
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                minWidth: 0,
              }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 999,
                  bgcolor: theme.palette.primary.light,
                  display: 'grid',
                  placeItems: 'center',
                  color: theme.palette.primary.contrastText,
                }}
              >
                <FavoriteBorderIcon fontSize="small" />
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Saved chefs
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {savedChefs}
                </Typography>
              </Box>
            </Box>

            <Divider orientation="vertical" flexItem />

            <Box
              sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                minWidth: 0,
              }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 999,
                  bgcolor: theme.palette.secondary.light,
                  display: 'grid',
                  placeItems: 'center',
                  color: theme.palette.secondary.contrastText,
                }}
              >
                <RestaurantMenuIcon fontSize="small" />
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Meals prepped
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {totalMealsPrepped}
                </Typography>
              </Box>
            </Box>

            <Divider orientation="vertical" flexItem />

            <Box
              sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: 1,
                minWidth: 0,
              }}
            >
              <Button
                variant={hasDietaryPreferences ? 'contained' : 'outlined'}
                size="small"
                startIcon={<LocalDiningIcon fontSize="small" />}
                sx={{
                  borderRadius: 999,
                  textTransform: 'none',
                  fontWeight: 700,
                  px: 1.5,
                  whiteSpace: 'nowrap',
                }}
              >
                {hasDietaryPreferences ? 'Dietary set' : 'Dietary prefs'}
              </Button>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Recent order section */}
      <Box sx={{ mt: 1 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 1,
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Recent order
          </Typography>
          <Button
            variant="text"
            size="small"
            endIcon={<ArrowForwardIosIcon sx={{ fontSize: 14 }} />}
            sx={{ textTransform: 'none', fontWeight: 600 }}
            onClick={() => navigate('/customer/orders')}
          >
            View all
          </Button>
        </Box>

        {hasRecentOrder ? (
          <Card
            variant="outlined"
            sx={{
              borderRadius: 3,
              borderColor: 'rgba(0,0,0,0.08)',
            }}
          >
            <CardContent>
              {/* Placeholder until orders are wired up */}
              <Typography variant="body2">Most recent order details go here.</Typography>
            </CardContent>
          </Card>
        ) : (
          <Card
            variant="outlined"
            sx={{
              borderRadius: 3,
              borderStyle: 'dashed',
              borderColor: 'rgba(0,0,0,0.2)',
              bgcolor: theme.palette.mode === 'light' ? '#f9fafb' : 'background.paper',
            }}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                No current orders
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Once you place an order, it will appear here for quick access.
              </Typography>
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  )
}