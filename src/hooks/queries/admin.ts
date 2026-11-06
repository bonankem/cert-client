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

/** Submissions waiting for approval (sidebar badge, dashboard notice). */
export const usePendingCount = () =>
  useQuery({ queryKey: queryKeys.pendingCount, queryFn: adminApi.pendingCount, refetchInterval: 60_000 })

/** Approve / reject change lists, details, counts and the dashboard, so refresh all admin data. */
export function useApproveResponses() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: adminApi.approve,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.admin }),
  })
}

export function useRejectResponse() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: adminApi.reject,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.admin }),
  })
}

export function useApproveUpdate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: adminApi.approveUpdate,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.admin }),
  })
}

export function useRejectUpdate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: adminApi.rejectUpdate,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.admin }),
  })
}

export const useNotificationEmails = () =>
  useQuery({ queryKey: queryKeys.notificationEmails, queryFn: adminApi.notificationEmails })

export function useSaveNotificationEmails() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: adminApi.saveNotificationEmails,
    onSuccess: (saved) => queryClient.setQueryData(queryKeys.notificationEmails, saved),
  })
}

export const useSendTestNotification = () => useMutation({ mutationFn: adminApi.sendTestNotification })

export const useRoster = () => useQuery({ queryKey: queryKeys.roster, queryFn: adminApi.roster })

/** Roster changes can auto-approve submissions, so refresh everything admin. */
function useRosterMutation<T, R>(mutationFn: (arg: T) => Promise<R>) {
  const queryClient = useQueryClient()
  return useMutation({ mutationFn, onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.admin }) })
}

export const useAddToRoster = () => useRosterMutation(adminApi.addToRoster)
export const useRemoveFromRoster = () => useRosterMutation(adminApi.removeFromRoster)
export const useClearRoster = () => useRosterMutation(adminApi.clearRoster)

export function useSaveSettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: adminApi.saveSettings,
    onSuccess: (saved) => queryClient.setQueryData(queryKeys.settings, saved),
  })
}
