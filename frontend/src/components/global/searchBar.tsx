import TextField, {type TextFieldProps } from '@mui/material/TextField'
import { Autocomplete, InputAdornment, useTheme } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { getRecentSearches, saveRecentSearch } from '../../utils/recentSearchesLite'
import { useBrowseFilters } from '../../hooks/useBrowseFilters'
import { useEffect, useState } from 'react'
import { useDebounce } from '../../hooks/useDebounce'

type SearchBarProps = Omit<TextFieldProps, 'variant'> & {
  width?: string
}

export default function SearchBar({ width = '18rem', InputProps, sx, ...rest }: SearchBarProps) {
  const theme = useTheme()
  const recentSearches = getRecentSearches()
  const [search, setSearchVal] = useState('')
  const { setFilter } = useBrowseFilters()

  const debouncedSearch = useDebounce(search, 1000)

useEffect(() => {
  setFilter('search', debouncedSearch)
  saveRecentSearch(debouncedSearch)
}, [debouncedSearch])

  return (

    <Autocomplete
      freeSolo
      options={recentSearches}
      inputValue={search}
      onInputChange={(_, value: string) => {
        setSearchVal(value)
      }}
      inputMode='search'
      renderInput={(params) => (
        <TextField
          {...params}
          size="small"
          placeholder="Search for a chef"
          aria-label="Search for a chef"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon sx={{ color: theme.palette.text.primary }} />
              </InputAdornment>
            ),
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
      )}
    />
  )
}

