"use client"
import React from 'react'
import {
  CircularProgress,
  Card,
  CardContent,
  Box,
  Button,
  TextField,
  Typography,
  Divider,
  InputAdornment,
  IconButton,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Link,
} from '@mui/material'
import { FcGoogle } from 'react-icons/fc'
import { FaFacebook } from 'react-icons/fa'
import { MdOutlineEmail } from 'react-icons/md'
import { RiLockPasswordLine } from 'react-icons/ri'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import Logo from '../Logo'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import { useSnackbar } from '../Ui/SnackbarProvider'
import { useRouter } from 'next/navigation'
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

const SignUp: React.FC = () => {
  const [fullName, setFullName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')
  const [role, setRole] = React.useState('buyer')
  const [agree, setAgree] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [socialLoading, setSocialLoading] = React.useState<null | 'google' | 'facebook'>(null)
  const [errors, setErrors] = React.useState<{ [k: string]: string }>({})
  const [showPassword, setShowPassword] = React.useState(false)
  const [method, setMethod] = React.useState<'email' | 'phone'>('email')
  const [phone, setPhone] = React.useState('')
  const snackbar = useSnackbar()
  const router = useRouter()

  const validate = () => {
    const e: { [k: string]: string } = {}
    if (!fullName.trim()) e.fullName = 'Full name is required'
    if (method === 'email') {
      if (!email.trim()) e.email = 'Email is required'
      else {
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|\".+\")@(([^<>()[\]\\.,;:\s@\"]+\.)+[^<>()[\]\\.,;:\s@\"]{2,})$/i
        if (!re.test(email)) e.email = 'Enter a valid email'
      }
    } else {
      if (!phone || !isValidPhoneNumber(phone)) e.phone = 'Enter a valid phone number'
    }
    if (!password) e.password = 'Password is required'
    if (password && password.length < 6) e.password = 'Password must be at least 6 characters'
    if (confirmPassword !== password) e.confirmPassword = 'Passwords do not match'
    if (!role) e.role = 'Please select a role'
    if (!agree) e.agree = 'You must agree to the Terms and Privacy Policy'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (ev?: React.FormEvent) => {
    ev?.preventDefault()
    if (!validate()) return
    // simulate async submission (replace with real API call)
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      console.log({ fullName, email, password, role, phone })
      snackbar.show('Account created — check your email or phone for verification', 'info')
      // redirect to verification page (stub)
      router.push('/auth/verify')
    }, 1200)
  }

  return (
    <div className="w-full max-w-[440px] mx-auto p-6">
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <Logo />
      </Box>

      <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)' }}>
        <CardContent sx={{ p: { xs: 4, sm: 5 } }}>
          <Typography variant="h5" component="h1" sx={{ mb: 1.5, fontWeight: 600, fontSize: '1.25rem' }}>
            Create account
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4, fontSize: '0.875rem' }}>
            Enter your details to create an account
          </Typography>

          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
              <ToggleButtonGroup value={method} exclusive onChange={(_, v) => v && setMethod(v)} size="small">
                <ToggleButton value="email">Email</ToggleButton>
                <ToggleButton value="phone">Phone</ToggleButton>
              </ToggleButtonGroup>

              <TextField
                fullWidth
                label="Full name"
                variant="outlined"
                size="small"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                error={!!errors.fullName}
                helperText={errors.fullName}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    height: '44px',
                    '& fieldset': { borderColor: '#D1D5DB' },
                    '&:hover fieldset': { borderColor: '#E11D48' },
                    '&.Mui-focused fieldset': { borderColor: '#E11D48' },
                  },
                  '& .MuiInputLabel-root': { '&.Mui-focused': { color: '#E11D48' } },
                  '& .MuiOutlinedInput-input': { padding: '12px 14px 12px 0' },
                }}
              />

              {method === 'email' ? (
                <TextField
                  fullWidth
                  label="Email address"
                  variant="outlined"
                  size="small"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={!!errors.email}
                  helperText={errors.email}
                  sx={{ '& .MuiOutlinedInput-root': { height: '44px' }, '& .MuiInputLabel-root': { '&.Mui-focused': { color: '#E11D48' } } }}
                  InputProps={{ startAdornment: (<InputAdornment position="start"><MdOutlineEmail className="text-gray-400" size={18} /></InputAdornment>) }}
                />
              ) : (
                <Box sx={{ width: '100%' }}>
                  <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, px: 1, py: 0.5 }}>
                    <PhoneInput
                      international
                      defaultCountry="NG"
                      value={phone}
                      onChange={(val) => setPhone(val ?? '')}
                      placeholder="Enter phone number"
                      style={{ width: '100%', fontSize: 14, padding: '6px 8px', background: 'transparent' }}
                    />
                  </Box>
                  {errors.phone && <Typography variant="caption" color="error">{errors.phone}</Typography>}
                </Box>
              )}

              <TextField
                select
                fullWidth
                label="Role"
                size="small"
                value={role}
                onChange={(e) => setRole(String(e.target.value))}
                error={!!errors.role}
                helperText={errors.role}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    height: '44px',
                    '& fieldset': { borderColor: '#D1D5DB' },
                    '&:hover fieldset': { borderColor: '#E11D48' },
                    '&.Mui-focused fieldset': { borderColor: '#E11D48' },
                  },
                }}
              >
                <MenuItem value="buyer">Buyer</MenuItem>
                <MenuItem value="seller">Seller</MenuItem>
              </TextField>

              <TextField
                fullWidth
                label="Password"
                variant="outlined"
                type={showPassword ? 'text' : 'password'}
                size="small"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!errors.password}
                helperText={errors.password}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    height: '44px',
                    '& fieldset': { borderColor: '#D1D5DB' },
                    '&:hover fieldset': { borderColor: '#E11D48' },
                    '&.Mui-focused fieldset': { borderColor: '#E11D48' },
                  },
                  '& .MuiInputLabel-root': { '&.Mui-focused': { color: '#E11D48' } },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <RiLockPasswordLine className="text-gray-400" size={18} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton aria-label="toggle password visibility" onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                        {showPassword ? <AiOutlineEyeInvisible size={18} className="text-gray-400" /> : <AiOutlineEye size={18} className="text-gray-400" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Confirm password"
                variant="outlined"
                type={showPassword ? 'text' : 'password'}
                size="small"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    height: '44px',
                    '& fieldset': { borderColor: '#D1D5DB' },
                    '&:hover fieldset': { borderColor: '#E11D48' },
                    '&.Mui-focused fieldset': { borderColor: '#E11D48' },
                  },
                  '& .MuiInputLabel-root': { '&.Mui-focused': { color: '#E11D48' } },
                }}
              />

              {/* agreement checkbox */}
              <div className="flex flex-col">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={agree}
                      onChange={(e) => setAgree(e.target.checked)}
                      sx={{ color: '#E11D48', '&.Mui-checked': { color: '#E11D48' } }}
                    />
                  }
                  label={
                    <Typography variant="body2">
                      I agree to the <Link href="/terms" underline="hover" sx={{ color: 'var(--accent)' }}>Terms</Link> and <Link href="/privacy" underline="hover" sx={{ color: 'var(--accent)' }}>Privacy Policy</Link>
                    </Typography>
                  }
                />
                {errors.agree && (
                  <Typography variant="caption" color="error" sx={{ ml: 6 }}>
                    {errors.agree}
                  </Typography>
                )}
              </div>

              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={18} color="inherit" /> : undefined}
                sx={{ bgcolor: 'var(--accent)', height: '44px', borderRadius: '8px', textTransform: 'none', fontWeight: 600, '&:hover': { bgcolor: '#C3143A' } }}
              >
                {loading ? 'Signing up...' : 'Sign up'}
              </Button>
            </div>
          </form>

          <div className="flex items-center gap-6 mt-6 mb-4">
            <Divider sx={{ flex: 1 }} />
            <Typography variant="body1" color="text.secondary" sx={{ px: 2 }}>
              OR
            </Typography>
            <Divider sx={{ flex: 1 }} />
          </div>

          {/* Social provider buttons */}
          <div className="flex flex-col gap-3 mt-2">
            <Button
              variant="outlined"
              fullWidth
              size="large"
              onClick={() => {
                setSocialLoading('google')
                setTimeout(() => setSocialLoading(null), 1000)
              }}
              startIcon={socialLoading === 'google' ? <CircularProgress size={18} color="inherit" /> : undefined}
              sx={{
                borderColor: '#dd4b39',
                color: '#dd4b39',
                borderWidth: '1px',
                borderRadius: '8px',
                height: '44px',
                display: 'flex',
                gap: '1rem',
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 500,
                justifyContent: 'center',
              }}
            >
              <FcGoogle size={20} />
              Sign up with Google
            </Button>

            <Button
              variant="outlined"
              fullWidth
              size="large"
              onClick={() => {
                setSocialLoading('facebook')
                setTimeout(() => setSocialLoading(null), 1000)
              }}
              startIcon={socialLoading === 'facebook' ? <CircularProgress size={18} color="inherit" /> : undefined}
              sx={{
                borderColor: '#3b5998',
                color: '#3b5998',
                borderWidth: '1px',
                borderRadius: '8px',
                height: '44px',
                display: 'flex',
                gap: '1rem',
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 500,
                justifyContent: 'center',
              }}
            >
              <FaFacebook size={20} />
              Sign up with Facebook
            </Button>
          </div>

          <div className="text-center mt-2">
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Already have an account?{' '}
              <Link href="/auth/signin" underline="hover" sx={{ color: '#E11D48', fontWeight: 600 }} onClick={(e) => { e.preventDefault(); router.push('/auth/signin') }}>
                Sign in
              </Link>
            </Typography>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SignUp
