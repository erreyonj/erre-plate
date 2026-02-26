import { Alert, AlertTitle } from '@mui/material'

interface PublishValidationAlertProps {
  errors: string[]
}

export default function PublishValidationAlert({ errors }: PublishValidationAlertProps) {
  if (errors.length === 0) {
    return null
  }

  return (
    <Alert severity="warning" variant="outlined" sx={{ borderRadius: 2 }}>
      <AlertTitle>Menu is not ready to publish</AlertTitle>
      <ul className="list-disc pl-4 space-y-1 text-sm">
        {errors.map((error) => (
          <li key={error}>{error}</li>
        ))}
      </ul>
    </Alert>
  )
}

