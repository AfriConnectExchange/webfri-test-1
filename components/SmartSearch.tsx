"use client"
import React from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import IconButton from '@mui/material/IconButton'
import ClearIcon from '@mui/icons-material/Clear'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import { useRouter } from 'next/navigation'

// Mock product list — replace with real API in future
const PRODUCTS = [
  'Red Sneakers',
  'Blue Denim Jacket',
  'Leather Wallet',
  'Wireless Headphones',
  'Black Running Shoes',
  'Cotton T-Shirt',
  'Smart Watch',
  'Portable Charger',
  'Sunglasses',
  'Backpack',
  'Office Chair',
  'Laptop Stand',
]

type SmartSearchProps = {
  placeholder?: string
  disablePortal?: boolean
}

type SmartSearchHandle = {
  submit: () => void
}

const SmartSearch = React.forwardRef<SmartSearchHandle, SmartSearchProps>(
  function SmartSearch(
    { placeholder = 'Search products, vendors...', disablePortal = false }: SmartSearchProps,
    ref: React.Ref<SmartSearchHandle>
  ) {
    const router = useRouter()
    const [inputValue, setInputValue] = React.useState('')
    const [options, setOptions] = React.useState<string[]>([])
    const [loading, setLoading] = React.useState(false)

    // debounce and filter mock products
    React.useEffect(() => {
      if (!inputValue || inputValue.trim().length < 1) {
        setOptions([])
        setLoading(false)
        return
      }
      setLoading(true)
      const id = setTimeout(() => {
        const q = inputValue.trim().toLowerCase()
        const matches = PRODUCTS.filter((p) => p.toLowerCase().includes(q)).slice(0, 8)
        setOptions(matches)
        setLoading(false)
      }, 250)
      return () => clearTimeout(id)
    }, [inputValue])

    const handleSubmit = (q?: string) => {
      const query = (q ?? inputValue).trim()
      if (!query) return
      router.push(`/search?q=${encodeURIComponent(query)}`)
    }

    // expose an imperative submit() so parent can trigger search (used by header Search button)
    React.useImperativeHandle(ref, () => ({
      submit: () => handleSubmit(),
    }))

    return (
      <Autocomplete
        freeSolo
        disablePortal={disablePortal}
        options={options}
        inputValue={inputValue}
        onInputChange={(_, value) => setInputValue(value)}
        onChange={(_, value) => {
          if (typeof value === 'string') handleSubmit(value)
        }}
        filterOptions={(x) => x} // we already filter
        popupIcon={null}
        clearOnBlur={false}
        renderInput={(params) => (
          <Box
            component="form"
            onSubmit={(e: React.FormEvent) => { e.preventDefault(); handleSubmit() }}
            sx={{
              // Ensure the search input grows on small/tablet screens but never overflows viewport
              width: {
                xs: '100%',
                sm: 'min(92vw, 560px)',
                md: 560,
              },
            }}
          >
            <TextField
              {...params}
              size="small"
              placeholder={placeholder}
              fullWidth
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" aria-hidden />
                  </InputAdornment>
                ),
                endAdornment: (
                  <>
                    {loading ? <CircularProgress size={18} sx={{ mr: 0.5 }} /> : null}
                    {inputValue ? (
                      <InputAdornment position="end">
                        <IconButton size="small" aria-label="clear search" onClick={() => setInputValue('')}>
                          <ClearIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ) : null}
                  </>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(0,0,0,0.12)', borderRadius: '12px' },
                  '&:hover fieldset': { borderColor: '#E11D48' },
                  '&.Mui-focused fieldset': { borderColor: '#E11D48' },
                  '& input': { padding: '10px 12px' },
                },
              }}
              inputProps={{ ...params.inputProps, 'aria-label': 'Smart search' }}
            />
          </Box>
        )}
        renderOption={(props, option) => (
          <li {...props} key={option}>
            {option}
          </li>
        )}
      />
    )
  }
)

// Helpful for devtools and better stack traces
SmartSearch.displayName = 'SmartSearch'

export default SmartSearch
