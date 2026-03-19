import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Box, Button, Stack, TextField, Typography, MenuItem } from '@mui/material'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { api } from '../../services/api'
import { queryKeys } from '../../services/queryKeys'
import type { User } from '../../types/user'

type RoleChoice = 'customer' | 'chef'

export default function SocialOnboarding() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user, isLoading } = useAuth()

  const [role, setRole] = useState<RoleChoice>('customer')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [zip, setZip] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoading && user) {
      setFirstName((prev) => prev || user.first_name || '')
      setLastName((prev) => prev || user.last_name || '')
    }
  }, [isLoading, user])

  if (isLoading) return null
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== null) return <Navigate to="/dashboard" replace />

  const handleContinue = async () => {
    setError(null)
    setIsSaving(true)
    try {
      const response = await api.put<User>('/profile', {
        role,
        first_name: firstName || undefined,
        last_name: lastName || undefined,
        address: zip ? { zip } : undefined,
      })

      const updatedUser = response.data
      // Keep auth context in sync; otherwise ProtectedRoute still sees role=null and sends users back here.
      queryClient.setQueryData(queryKeys.auth.me(), (prev: User | undefined) => ({
        ...prev,
        ...updatedUser,
      }))

      if (updatedUser.role === 'chef') {
        navigate('/chef/profile/edit', { replace: true })
      } else if (updatedUser.role === 'customer') {
        navigate('/customer/browse', { replace: true })
      } else {
        setError('Unable to complete onboarding.')
      }
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: unknown }).message)
          : 'Unable to complete onboarding.'
      setError(message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 480 }}>
      <Typography variant="h5" fontWeight={700}>
        Finish setting up your account
      </Typography>
      <Typography mt={1} color="text.secondary">
        Choose how you want to use errePlate and complete the basics.
      </Typography>

      <Stack spacing={2.5} mt={4}>
        {error && (
          <Box
            role="alert"
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: 'rgba(220, 38, 38, 0.08)',
              color: 'rgb(185, 28, 28)',
              fontSize: 14,
            }}
          >
            {error}
          </Box>
        )}

        <TextField
          select
          label="Role"
          value={role}
          onChange={(e) => setRole(e.target.value as RoleChoice)}
          fullWidth
        >
          <MenuItem value="customer">Customer</MenuItem>
          <MenuItem value="chef">Chef</MenuItem>
        </TextField>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            label="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            fullWidth
          />
          <TextField
            label="Last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            fullWidth
          />
        </Stack>

        <TextField
          label="ZIP code (optional)"
          value={zip}
          onChange={(e) => setZip(e.target.value)}
          fullWidth
        />

        <Button
          variant="contained"
          onClick={handleContinue}
          disabled={isSaving}
          sx={{ py: 1.5, fontWeight: 700 }}
        >
          {isSaving ? 'Saving…' : 'Continue'}
        </Button>
      </Stack>
    </Box>
  )
}

