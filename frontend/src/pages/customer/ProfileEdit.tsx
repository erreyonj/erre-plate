import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from '@mui/material'
import { PhotoUpload } from '../../components/user/photoUpload'
import { useTheme } from '@mui/material/styles'
import { useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useUpdateProfileMutation } from '../../hooks/useProfiles'
import { useLoadScript, Autocomplete } from '@react-google-maps/api'
import { useState, useRef } from 'react'
import { eplateColors } from '../../../design/theme'
import { queryKeys } from '../../services/queryKeys'

type ProfileFormValues = {
  first_name: string
  last_name: string
  phone?: string | null
  dietary_preferences?: string | null
  allergies?: string | null
}

export default function CustomerProfileEdit() {
  const theme = useTheme()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { user } = useAuth()
  const updateProfile = useUpdateProfileMutation()
  const [isInEditMode, setIsInEditMode] = useState(false)

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
    libraries: ['places'],
  })

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<ProfileFormValues>({
    defaultValues: {
      first_name: user?.first_name ?? '',
      last_name: user?.last_name ?? '',
      phone: user?.phone ?? '',
      dietary_preferences: '',
      allergies: '',
    },
  })

  const onSubmit = async (values: ProfileFormValues) => {
    await updateProfile.mutateAsync(values)
    queryClient.invalidateQueries({queryKey: queryKeys.auth.me()})
    navigate('/customer/profile')
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 800 }}>
        Edit profile
      </Typography>

      <Card
        variant="outlined"
        sx={{
          borderRadius: 3,
          borderColor: 'rgba(0,0,0,0.08)',
        }}
      >
        <CardContent>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <Box sx={{ display: 'flex', gap: 1.5 }}>

              <PhotoUpload />

              <TextField
                label="First name"
                fullWidth
                {...register('first_name', { required: 'First name is required' })}
                error={!!errors.first_name}
                helperText={errors.first_name?.message}
                disabled={!isInEditMode}
              />
              <TextField
                label="Last name"
                fullWidth
                {...register('last_name', { required: 'Last name is required' })}
                error={!!errors.last_name}
                helperText={errors.last_name?.message}
                disabled={!isInEditMode}
              />
            </Box>

            <TextField
              label="Phone"
              fullWidth
              {...register('phone')}
              disabled={!isInEditMode}
            />

            {/* <Box
              sx={{
                mt: 2,
                p: 1.5,
                borderRadius: 2,
                bgcolor: theme.palette.mode === 'light' ? '#f9fafb' : 'background.paper',
                border: '1px dashed rgba(0,0,0,0.15)',
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                Address
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Address editing will be available soon once Google Places is wired up.
              </Typography>
            </Box> */}

            {isLoaded && (
              <Autocomplete
              onLoad={(auto) => (autocompleteRef.current = auto)}
              onPlaceChanged={() => {
                const place = autocompleteRef.current?.getPlace()
                console.log(place)
              }}
            >
              <TextField fullWidth label="Address" />
            </Autocomplete>
            )}

            <TextField
              label="Dietary preferences"
              fullWidth
              multiline
              minRows={2}
              {...register('dietary_preferences')}
              disabled={!isInEditMode}
            />

            <TextField
              label="Allergies"
              fullWidth
              multiline
              minRows={2}
              {...register('allergies')}
              disabled={!isInEditMode}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 2 }}>
              {isInEditMode ?
                <Button
                  type="button"
                  variant="text"
                  onClick={() => navigate('/customer/profile')}
                >
                  Cancel
                </Button>
                :
                <Button
                  type="submit"
                  variant="contained"
                  sx={{bgcolor: eplateColors.terracotta}}
                  onClick={() => setIsInEditMode(true)}
                  // disabled={isSubmitting || updateProfile.isPending}
                >
                  Make Changes?
                </Button>
                
              }

              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting || updateProfile.isPending || !isInEditMode}
              >
                Save changes
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

