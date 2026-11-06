import { useMutation, useQuery } from '@tanstack/react-query'
import { publicApi } from '@/api'
import { DEFAULT_SETTINGS } from '@/config/constants'
import { queryKeys } from './keys'

/** Questions, sections and OpCos — owned by the server. */
export const useFormConfig = () =>
  useQuery({ queryKey: queryKeys.formConfig, queryFn: publicApi.formConfig, staleTime: Infinity })

/** Trainer name, date range and signature used to draw certificates. */
export function useCertificateSettings() {
  const query = useQuery({ queryKey: queryKeys.settings, queryFn: publicApi.certificateSettings, staleTime: 60_000 })
  return { ...query, settings: query.data ?? DEFAULT_SETTINGS }
}

export const useSubmitResponse = () => useMutation({ mutationFn: publicApi.submitResponse })

/** The participant's own submission, by its private token. Re-checks every 30 s while pending. */
export const useSubmissionStatus = (token: string | undefined) =>
  useQuery({
    queryKey: queryKeys.submissionStatus(token ?? ''),
    queryFn: () => publicApi.submissionStatus(token!),
    enabled: !!token,
    refetchInterval: (query) => (query.state.data?.status === 'pending' ? 30_000 : false),
    retry: (count, error) => count < 2 && !(error instanceof Error && 'status' in error && error.status === 404),
  })

export const useVerifyPublic = (code: string | undefined) =>
  useQuery({
    queryKey: ['verify', code] as const,
    queryFn: () => publicApi.verify(code!),
    enabled: !!code,
    staleTime: 60_000,
  })
