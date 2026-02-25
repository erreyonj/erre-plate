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
import StarIcon from '@mui/icons-material/Star'
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu'
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import type { User } from '../../types/user'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

function getDisplayName(user: User | null | undefined) {
  if (!user) return 'Chef'
  if (user.name) return user.name
  return `${user.first_name} ${user.last_name}`.trim()
}

export default function ChefProfile() {
  const theme = useTheme()
  const { user } = useAuth()
  const navigate = useNavigate()

  const displayName = getDisplayName(user)

  // Placeholder stats until wired to real chef metrics
  const rating = 0
  const totalMealsPrepped = 0
  const hasActiveTicket = false

  const tagline = 'Crafting stellar meals for every orbit.'
  const certifications = ['ServSafe', 'Allergen aware']

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
            Chef profile
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

      {/* Hero card - larger to include certs + tagline */}
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
            alignItems: 'flex-start',
            gap: 2,
          }}
        >
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: theme.palette.primary.main,
              fontWeight: 800,
              fontSize: 30,
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
              sx={{ color: 'text.secondary', mb: 1 }}
              noWrap
            >
              {user?.email ?? 'you@example.com'}
            </Typography>

            <Typography
              variant="body2"
              sx={{ mb: 1 }}
            >
              {tagline}
            </Typography>

            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {certifications.map((cert) => (
                <Chip
                  key={cert}
                  label={cert}
                  size="small"
                  sx={{
                    borderRadius: 999,
                    fontSize: 11,
                    fontWeight: 600,
                    bgcolor: theme.palette.mode === 'light' ? '#f3f4ff' : 'background.paper',
                  }}
                />
              ))}
            </Stack>
          </Box>

          <Button
            variant="outlined"
            size="small"
            sx={{
              borderRadius: 999,
              textTransform: 'none',
              fontWeight: 700,
              whiteSpace: 'nowrap',
              alignSelf: 'flex-start',
            }}
          >
            Edit profile
          </Button>
        </CardContent>
      </Card>

      {/* Stat bar */}
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
            {/* Rating */}
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
                  bgcolor: theme.palette.warning.light,
                  display: 'grid',
                  placeItems: 'center',
                  color: theme.palette.warning.contrastText,
                }}
              >
                <StarIcon fontSize="small" />
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Rating
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {rating.toFixed(1)}
                </Typography>
              </Box>
            </Box>

            <Divider orientation="vertical" flexItem />

            {/* Meals prepped */}
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

            {/* Current menu link */}
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                minWidth: 0,
              }}
            >
              <Button
                variant="outlined"
                size="small"
                endIcon={<ArrowForwardIosIcon sx={{ fontSize: 14 }} />}
                sx={{
                  borderRadius: 999,
                  textTransform: 'none',
                  fontWeight: 700,
                  px: 1.5,
                  whiteSpace: 'nowrap',
                }}
                onClick={() => navigate('/chef/dashboard')}
              >
                View menu
              </Button>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Active ticket section */}
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
            Active ticket
          </Typography>
          <Button
            variant="text"
            size="small"
            endIcon={<ArrowForwardIosIcon sx={{ fontSize: 14 }} />}
            sx={{ textTransform: 'none', fontWeight: 600 }}
            onClick={() => navigate('/chef/orders')}
          >
            View all
          </Button>
        </Box>

        {hasActiveTicket ? (
          <Card
            variant="outlined"
            sx={{
              borderRadius: 3,
              borderColor: 'rgba(0,0,0,0.08)',
            }}
          >
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <AssignmentTurnedInIcon color="primary" />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Active ticket details go here.
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  You can surface order number, ETA, and status when wired up.
                </Typography>
              </Box>
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
                No active tickets
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                When a new order comes in, the active ticket will appear here.
              </Typography>
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  )
}

