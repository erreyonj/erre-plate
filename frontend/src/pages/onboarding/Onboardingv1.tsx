import { useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { useForm, Controller } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  MenuItem,
  CircularProgress,
} from '@mui/material'
import { useRegisterMutation } from '../../hooks/useAuthHooks'

type FormValues = {
    first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role?: 'customer' | 'chef' | 'admin';
  phone?: string;
  dietary_preferences?: string,
  allergies?: string
  address: {
    street?: string
    city?: string
    state?: string
    zip?: string
    country?: string
    lat?: number
    lng?: number
  }
}

export default function OnboardingV1() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false })
  const { mutateAsync, isPending } = useRegisterMutation()
  const navigate = useNavigate()

  const {
    control,
    handleSubmit,
    watch,
    trigger,
  } = useForm<FormValues>({
    defaultValues: {
      role: 'customer',
      address: {},
    },
  })

  const next = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const prev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const onSubmit = async (data: FormValues) => {
    const payload = {
      first_name: data.first_name,
      last_name: data.last_name,
      phone: data.phone ?? null,
      dietary_preferences: data.dietary_preferences ?? null,
      allergies: data.allergies ?? null,
      role: data.role,
      address: data.address,
    }

    const registrant = await mutateAsync(data)
    const role = registrant.user.role
    const neighborhoodID = registrant.user.neighborhood_id?.toString()

    // redirect to browse or dashboard here
    navigate(`/${role}/browse?neighborhood=${encodeURIComponent(neighborhoodID || '')}`)
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 420 }} component='form' onSubmit={handleSubmit(onSubmit)}>
      <div ref={emblaRef} style={{ overflow: 'hidden' }}>
        {/* <form onSubmit={handleSubmit(onSubmit)}> */}
          <div style={{ display: 'flex' }}>

            {/* Slide 1: Welcome */}
            <Slide>
                <Typography variant="h5" fontWeight={700}>
                Welcome to airplate
                </Typography>
                <Typography mt={2}>
                Let’s set up your profile to discover chefs near you.
                </Typography>
                <Button sx={{ mt: 4 }} variant="contained" onClick={next}>
                Get Started
                </Button>
            </Slide>

            {/* Slide 2: Role */}
            <Slide>
              <Typography variant="h6">Choose your role</Typography>
              <Controller
                name="role"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    select
                    fullWidth
                    sx={{ mt: 3 }}
                    label="Role"
                    {...field}
                  >
                    <MenuItem value="customer">Customer</MenuItem>
                    <MenuItem value="chef">Chef</MenuItem>
                  </TextField>
                )}
              />
              <NavButtons next={next} prev={prev} />
            </Slide>

            {/* Slide 3: Account */}
            <Slide>
              <Typography variant="h6">Account Details</Typography>

              <Stack spacing={2} mt={3}>
                <Controller
                  name="email"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField label="Email" fullWidth {...field} />
                  )}
                />

                <Controller
                  name="password"
                  control={control}
                  rules={{ required: true, minLength: 6 }}
                  render={({ field }) => (
                    <TextField
                      label="Password"
                      type="password"
                      fullWidth
                      {...field}
                    />
                  )}
                />

                <Controller
                  name="password_confirmation"
                  control={control}
                  rules={{
                    required: true,
                    validate: (value) =>
                      value === watch('password') || 'Passwords do not match',
                  }}
                  render={({ field }) => (
                    <TextField
                      label="Confirm Password"
                      type="password"
                      fullWidth
                      {...field}
                    />
                  )}
                />
              </Stack>

              <NavButtons next={next} prev={prev} />
            </Slide>

            {/* Slide 4: Personal */}
            <Slide>
              <Typography variant="h6">Personal Info</Typography>
              <Stack spacing={2} mt={3}>
                <Controller
                  name="first_name"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField label="First Name" fullWidth {...field} />
                  )}
                />
                <Controller
                  name="last_name"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField label="Last Name" fullWidth {...field} />
                  )}
                />
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <TextField label="Phone" fullWidth {...field} />
                  )}
                />
              </Stack>
              <NavButtons next={next} prev={prev} />
            </Slide>

            {/* Slide 5: Address */}
            <Slide>
              <Typography variant="h6">Your Location</Typography>
              <Stack spacing={2} mt={3}>
                <Controller
                  name="address.street"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField label="Street" fullWidth {...field} />
                  )}
                />
                <Controller
                  name="address.city"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField label="City" fullWidth {...field} />
                  )}
                />
                <Controller
                  name="address.zip"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField label="ZIP Code" fullWidth {...field} />
                  )}
                />
              </Stack>
              <NavButtons next={next} prev={prev} />
            </Slide>

            {/* Slide 6: Dietary */}
            <Slide>
              <Typography variant="h6">Dietary Preferences</Typography>
              <Stack spacing={2} mt={3}>
                <Controller
                  name="dietary_preferences"
                  control={control}
                  render={({ field }) => (
                    <TextField label="Preferences (Or Skip)" fullWidth {...field} />
                  )}
                />
                <Controller
                  name="allergies"
                  control={control}
                  render={({ field }) => (
                    <TextField label="Allergies (Or Skip)" fullWidth {...field} />
                  )}
                />
              </Stack>
              <NavButtons next={next} prev={prev} />
            </Slide>

            {/* Slide 7: Submit */}
            <Slide>
              <Typography variant="h6">
                Ready to create your account?
              </Typography>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 4 }}
                disabled={isPending}
              >
                {isPending ? <CircularProgress size={20} /> : 'Create Account'}
              </Button>

              <Button sx={{ mt: 2 }} onClick={prev}>
                Back
              </Button>
            </Slide>

          </div>
        {/* </form> */}
      </div>
    </Box>
  )
}

function Slide({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ minWidth: '100%', px: 2, py: 4 }}>
      {children}
    </Box>
  )
}

function NavButtons({
  next,
  prev,
}: {
  next: () => void
  prev: () => void
}) {
  return (
    <Stack direction="row" justifyContent="space-between" mt={4}>
      <Button onClick={prev}>Back</Button>
      <Button variant="contained" onClick={next}>
        Continue
      </Button>
    </Stack>
  )
}