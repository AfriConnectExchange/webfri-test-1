"use client" 
import React from 'react';
import { Card, CardContent, Button, TextField, Typography, Divider, InputAdornment, IconButton, Link, CircularProgress } from '@mui/material';
import Box from '@mui/material/Box';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import { MdOutlineEmail } from 'react-icons/md';
import { RiLockPasswordLine } from 'react-icons/ri';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import Logo from '../Logo';

import { useRouter } from 'next/navigation'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import { useSnackbar } from '../Ui/SnackbarProvider'
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

const SignIn = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [socialLoading, setSocialLoading] = React.useState<null | 'google' | 'facebook'>(null);
  const [method, setMethod] = React.useState<'email' | 'phone'>('email')
  const [phone, setPhone] = React.useState('')
  const router = useRouter()
  const snackbar = useSnackbar()

  return (
    <div className="w-full max-w-[440px] mx-auto p-6">
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <Logo />
      </Box>
      
  <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)' }}>
        <CardContent sx={{ p: { xs: 4, sm: 5 } }}>
          <Typography variant="h5" component="h1" sx={{ mb: 1.5, fontWeight: 600, fontSize: '1.5rem' }}>
            Welcome Back
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mb: 5,
              fontSize: '0.875rem',
              color: 'rgb(100, 116, 139)'
            }}
          >
            Please sign in to your account
          </Typography>
          
          {/* Email/Phone toggle & Password Form */}
          <form className="mb-7">
            <div className="flex flex-col gap-4">
              <ToggleButtonGroup value={method} exclusive onChange={(_, v) => v && setMethod(v)} size="small">
                <ToggleButton value="email">Email</ToggleButton>
                <ToggleButton value="phone">Phone</ToggleButton>
              </ToggleButtonGroup>

              {method === 'email' ? (
                <TextField
                  fullWidth
                  label="Email address"
                  variant="outlined"
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': { height: '44px' },
                  }}
                  InputProps={{ startAdornment: (<InputAdornment position="start"><MdOutlineEmail className="text-gray-400" size={18} /></InputAdornment>) }}
                />
              ) : (
                <Box sx={{ width: '100%' }}>
                  {/* visible wrapper in case the package stylesheet isn't applied */}
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
                </Box>
              )}

              <TextField
                fullWidth
                label="Password"
                variant="outlined"
                type={showPassword ? 'text' : 'password'}
                size="small"
                sx={{ '& .MuiOutlinedInput-root': { height: '44px' } }}
                InputProps={{
                  startAdornment: (<InputAdornment position="start"><RiLockPasswordLine className="text-gray-400" size={18} /></InputAdornment>),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton aria-label="toggle password visibility" onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                        {showPassword ? <AiOutlineEyeInvisible size={18} className="text-gray-400" /> : <AiOutlineEye size={18} className="text-gray-400" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <div className="flex justify-end -mt-2 mb-2">
                <Link href="/auth/forgot" underline="hover" sx={{ color: '#E11D48', fontSize: '0.875rem' }} onClick={(e) => { e.preventDefault(); router.push('/auth/forgot') }}>Forgot password?</Link>
              </div>

              <Button
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                onClick={() => {
                  // basic validation for phone method
                  if (method === 'phone') {
                    if (!phone || !isValidPhoneNumber(phone)) {
                      snackbar.show('Please enter a valid phone number', 'warning')
                      return
                    }
                  }
                  setLoading(true);
                  setTimeout(() => {
                    setLoading(false);
                    snackbar.show('Signed in successfully', 'success')
                    router.push('/postauth')
                  }, 900)
                }}
                startIcon={loading ? <CircularProgress size={18} color="inherit" /> : undefined}
                sx={{ bgcolor: 'var(--accent)', height: '44px', borderRadius: '8px', textTransform: 'none', fontSize: '1rem', fontWeight: 500, boxShadow: 'none', '&:hover': { bgcolor: '#C3143A', boxShadow: 'none' } }}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>
            </div>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-6 mb-8">
            <Divider sx={{ flex: 1 }} />
            <Typography variant="body1" color="text.secondary" sx={{ px: 2 }}>
              OR
            </Typography>
            <Divider sx={{ flex: 1 }} />
          </div>

          {/* Social Buttons */}
          <div className="flex flex-col gap-4">
            <Button
              variant="outlined"
              fullWidth
              size="large"
              onClick={() => {
                setSocialLoading('google');
                setTimeout(() => setSocialLoading(null), 1000);
              }}
              startIcon={socialLoading === 'google' ? <CircularProgress size={18} color="inherit" /> : undefined}
              sx={{
                borderColor: '#dd4b39',
                color: '#dd4b39',
                borderWidth: '1px',
                borderRadius: '8px',
                height: '44px',
                '&:hover': {
                  borderColor: '#dd4b39',
                  backgroundColor: 'rgba(221, 75, 57, 0.04)',
                  borderWidth: '1px'
                },
                display: 'flex',
                gap: '1rem',
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 500,
                justifyContent: 'center'
              }}
            >
              <FcGoogle size={20} />
              Sign in with Google
            </Button>

            <Button
              variant="outlined"
              fullWidth
              size="large"
              onClick={() => {
                setSocialLoading('facebook');
                setTimeout(() => setSocialLoading(null), 1000);
              }}
              startIcon={socialLoading === 'facebook' ? <CircularProgress size={18} color="inherit" /> : undefined}
              sx={{
                borderColor: '#3b5998',
                color: '#3b5998',
                borderWidth: '1px',
                borderRadius: '8px',
                height: '44px',
                '&:hover': {
                  borderColor: '#3b5998',
                  backgroundColor: 'rgba(59, 89, 152, 0.04)',
                  borderWidth: '1px'
                },
                display: 'flex',
                gap: '1rem',
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 500,
                justifyContent: 'center'
              }}
            >
              <FaFacebook size={20} />
              Sign in with Facebook
            </Button>
          </div>
          {/* signup prompt */}
          <div className="mt-4 text-center">
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Don&apos;t have an account?{' '}
              <Link href="/auth/signup" underline="hover" sx={{ color: '#E11D48', fontWeight: 600 }} onClick={(e) => { e.preventDefault(); router.push('/auth/signup') }}>
                Sign up
              </Link>
            </Typography>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignIn;