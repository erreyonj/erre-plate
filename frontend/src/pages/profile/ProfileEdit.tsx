import {
  Stack,
} from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";
import  EditChefProfile  from '../../components/profile/EditChefProfile'
import  EditBaseProfile  from '../../components/profile/EditBaseProfile'

export default function EditProfile() {
  const { user } = useAuth()

  if (!user) return null

  return (
    <Stack spacing={4}>
      <EditBaseProfile />

      {user.role === 'chef' && (
        <EditChefProfile />
      )}
    </Stack>
  )
}
