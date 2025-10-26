import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { SessionUser } from '@/types/auth'

interface AuthState {
  user: SessionUser | null
  loading: boolean
  error: Error | null
}

interface UseAuthReturn extends AuthState {
  signOut: () => Promise<void>
  refreshSession: () => Promise<void>
  isAuthenticated: boolean
}

export function useAuth(): UseAuthReturn {
  const router = useRouter()
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null
  })

  // Fetch session data
  const fetchSession = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/session')
      if (!res.ok) {
        throw new Error('Failed to fetch session')
      }

      const data = await res.json()
      setState(prev => ({
        ...prev,
        user: data.user,
        loading: false
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error as Error,
        loading: false
      }))
    }
  }, [])

  // Initial session fetch
  useEffect(() => {
    fetchSession()
  }, [fetchSession])

  // Sign out function
  const signOut = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true }))
      const res = await fetch('/api/auth/signout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })

      if (!res.ok) {
        throw new Error('Failed to sign out')
      }

      setState({ user: null, loading: false, error: null })
      router.push('/auth/signin')
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error as Error,
        loading: false
      }))
    }
  }, [router])

  // Refresh session
  const refreshSession = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true }))
      await fetchSession()
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error as Error,
        loading: false
      }))
    }
  }, [fetchSession])

  return {
    ...state,
    signOut,
    refreshSession,
    isAuthenticated: !!state.user
  }
}

// Custom hook for protecting routes
export function useRequireAuth(redirectUrl: string = '/auth/signin') {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push(redirectUrl)
    }
  }, [loading, router, redirectUrl, user])

  return { user, loading }
}