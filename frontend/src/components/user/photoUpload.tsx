import { useAuth } from "../../contexts/AuthContext";
import { useUploadProfilePhoto } from "../../hooks/useProfiles";

export function PhotoUpload() {
  const { user } = useAuth()
  const { mutateAsync, isPending } = useUploadProfilePhoto()

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
    <div className="flex items-center space-x-4">
      <img
        src={user?.photo_url || '/default-avatar.png'}
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
        <span className="px-4 py-2 bg-blue-600 text-white rounded-md">
          {isPending ? 'Uploading...' : 'Change Photo'}
        </span>
      </label>
    </div>
  )
}