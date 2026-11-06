import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query'
import { isUnauthorized } from '@/api'
import { queryKeys } from '@/hooks/queries/keys'

/**
 * If any admin request comes back 401 (session expired or revoked), mark the
 * user as signed out; RequireAdmin then redirects to the login page.
 */
const onError = (error: unknown) => {
  if (isUnauthorized(error)) queryClient.setQueryData(queryKeys.me, null)
}

export const queryClient: QueryClient = new QueryClient({
  queryCache: new QueryCache({ onError }),
  mutationCache: new MutationCache({ onError }),
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: true,
      retry: (failureCount, error) => !isUnauthorized(error) && failureCount < 2,
    },
  },
})
