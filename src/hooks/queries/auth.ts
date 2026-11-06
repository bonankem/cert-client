import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authApi, isUnauthorized } from '@/api'
import type { LoginRequest } from '@/types'
import { queryKeys } from './keys'

/** The signed-in admin, or null when signed out. */
export function useMe() {
  return useQuery({
    queryKey: queryKeys.me,
    queryFn: async () => {
      try {
        return await authApi.me()
      } catch (error) {
        if (isUnauthorized(error)) return null
        throw error
      }
    },
    staleTime: 5 * 60_000,
    retry: false,
  })
}

export function useLogin() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      const user = await authApi.login(credentials)
      if (user.token && typeof window !== 'undefined') {
        localStorage.setItem('stablenet_sid', user.token)
      }
      return user
    },
    onSuccess: (user) => {
      queryClient.setQueryData(queryKeys.me, user)
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      try {
        await authApi.logout()
      } finally {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('stablenet_sid')
        }
      }
    },
    onSettled: () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('stablenet_sid')
      }
      // Drop every admin query so nothing leaks into the next session.
      queryClient.removeQueries({ queryKey: queryKeys.admin })
      queryClient.setQueryData(queryKeys.me, null)
    },
  })
}

export const useChangePassword = () => useMutation({ mutationFn: authApi.changePassword })
