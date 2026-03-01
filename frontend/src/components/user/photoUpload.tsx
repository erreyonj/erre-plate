import { Box, Typography, useTheme } from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";
import { useUploadProfilePhoto } from "../../hooks/useProfiles";
import defaultAvatar from "/erre.Plate-default-avatar.1.png"

export function PhotoUpload() {
  const { user } = useAuth()
  const { mutateAsync, isPending } = useUploadProfilePhoto()
  const theme = useTheme()

  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Basic validation
    if (!file.type.startsWith('image/')) {
    //   toast.error('Please upload an image')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
    //   toast.error('Max size is 5MB')
      return
    }

    try {
      await mutateAsync(file)
    //   toast.success('Photo updated!')
    } catch {
    //   toast.error('Upload failed')
    }
  }

  return (
    <Box className="flex flex-col gap-3 items-center space-x-4 w-full">
      <img
        src={user?.photo_url || defaultAvatar}
        alt="Profile"
        className="w-20 h-20 rounded-full object-cover"
      />
      <label className="cursor-pointer">
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="hidden"
          disabled={isPending}
        />
        <Typography className="px-4 py-2 text-white rounded-md" sx={{bgcolor: theme.palette.primary.main}}>
          {isPending ? 'Uploading...' : user?.photo_url ? 'Change Photo' : 'Upload Photo'}
        </Typography>
      </label>
    </Box>
  )
}