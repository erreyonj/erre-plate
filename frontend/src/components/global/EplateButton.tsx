import { Button, type ButtonProps } from '@mui/material'
import { useTheme } from '@mui/material/styles'

type EplateButtonVariant = 'primary' | 'secondary' | 'ghost'

interface EplateButtonProps extends Omit<ButtonProps, 'variant' | 'color'> {
  variantStyle?: EplateButtonVariant
  fullRounded?: boolean
}

export default function EplateButton({
  children,
  variantStyle = 'primary',
  fullRounded = true,
  sx,
  ...rest
}: EplateButtonProps) {
  const theme = useTheme()

  const baseStyles = {
    textTransform: 'none',
    borderRadius: fullRounded ? 999 : theme.shape.borderRadius,
    fontWeight: 600,
    boxShadow: 'none',
    '&:hover': { boxShadow: 'none' },
  } as const

  let variantStyles = {}

  if (variantStyle === 'primary') {
    variantStyles = {
      bgcolor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      '&:hover': {
        bgcolor: theme.palette.primary.dark,
      },
    }
  } else if (variantStyle === 'secondary') {
    variantStyles = {
      bgcolor: theme.palette.secondary.main,
      color: theme.palette.secondary.contrastText,
      '&:hover': {
        bgcolor: theme.palette.secondary.dark,
      },
    }
  } else if (variantStyle === 'ghost') {
    variantStyles = {
      bgcolor: 'transparent',
      border: `1px solid ${theme.palette.divider}`,
      color: theme.palette.text.primary,
      '&:hover': {
        bgcolor: 'rgba(0,0,0,0.04)',
      },
    }
  }

  return (
    <Button
      disableElevation
      sx={{ ...baseStyles, ...variantStyles, ...sx }}
      {...rest}
    >
      {children}
    </Button>
  )
}

