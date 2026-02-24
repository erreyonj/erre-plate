import TextField, {type TextFieldProps } from '@mui/material/TextField'
import { InputAdornment, useTheme } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

type SearchBarProps = Omit<TextFieldProps, 'variant'> & {
  width?: string
}

export default function SearchBar({ width = '18rem', InputProps, sx, ...rest }: SearchBarProps) {
  const theme = useTheme()
  return (
    <TextField
      size="small"
      placeholder="Search"
      aria-label="Search"
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <SearchIcon sx={{ color: theme.palette.text.primary }} />
          </InputAdornment>
        ),
        ...InputProps,
      }}
      sx={{
        width,
        '& .MuiOutlinedInput-root': {
          borderRadius: 999,
          bgcolor: 'rgba(0,0,0,0.08)',
          '& fieldset': { borderColor: 'transparent' },
          '&:hover fieldset': { borderColor: 'transparent' },
          '&.Mui-focused fieldset': { borderColor: 'transparent' },
        },
        ...sx,
      }}
      {...rest}
    />
  )
}

