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

export const useVerifyPublic = (code: string | undefined) =>
  useQuery({
    queryKey: ['verify', code] as const,
    queryFn: () => publicApi.verify(code!),
    enabled: !!code,
    staleTime: 60_000,
  })
