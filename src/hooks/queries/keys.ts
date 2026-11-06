import type { ListResponsesQuery } from '@/types'

/** React Query cache keys — hierarchical so a prefix invalidates everything below it. */
export const queryKeys = {
  formConfig: ['form-config'] as const,
  me: ['auth', 'me'] as const,
  settings: ['certificate-settings'] as const,
  admin: ['admin'] as const,
  dashboard: ['admin', 'dashboard'] as const,
  responses: ['admin', 'responses'] as const,
  responseList: (query: ListResponsesQuery) => ['admin', 'responses', 'list', query] as const,
  response: (certId: string) => ['admin', 'responses', 'detail', certId] as const,
}
