import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '@/api'
import type { ListResponsesQuery } from '@/types'
import { queryKeys } from './keys'

export const useDashboard = () =>
  useQuery({ queryKey: queryKeys.dashboard, queryFn: adminApi.dashboard, refetchInterval: 60_000 })

/** Server-paginated responses; keeps the current page visible while the next loads. */
export const useResponseList = (query: ListResponsesQuery) =>
  useQuery({
    queryKey: queryKeys.responseList(query),
    queryFn: ({ signal }) => adminApi.listResponses(query, signal),
    placeholderData: keepPreviousData,
  })

export const useResponse = (certId: string | undefined) =>
  useQuery({
    queryKey: queryKeys.response(certId ?? ''),
    queryFn: () => adminApi.getResponse(certId!),
    enabled: !!certId,
    retry: (count, error) => count < 2 && !(error instanceof Error && 'status' in error && error.status === 404),
  })

export function useDeleteResponse() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: adminApi.deleteResponse,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.admin }),
  })
}

export const useVerifyCertificate = () => useMutation({ mutationFn: adminApi.verify })

export function useSaveSettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: adminApi.saveSettings,
    onSuccess: (saved) => queryClient.setQueryData(queryKeys.settings, saved),
  })
}
