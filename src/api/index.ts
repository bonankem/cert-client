/** Typed API calls, grouped by audience. Components use these via hooks/queries. */
import type {
  AuthUser,
  CertificateSettings,
  CertificateSettingsView,
  ChangePasswordRequest,
  DashboardStats,
  FeedbackFormValues,
  FormConfig,
  ListResponsesQuery,
  LoginRequest,
  NotificationEmails,
  Paginated,
  ResponseDetail,
  ResponseFilters,
  ResponseSummary,
  RosterAddResult,
  RosterEntry,
  RosterEntryInput,
  SubmissionStatus,
  SubmitResult,
  VerifyResult,
} from '@/types'
import { ENDPOINTS } from './endpoints'
import { request, withQuery } from './http'

export const publicApi = {
  formConfig: () => request<FormConfig>(ENDPOINTS.formConfig),
  submitResponse: (values: FeedbackFormValues) =>
    request<SubmitResult>(ENDPOINTS.public.responses, { method: 'POST', body: values }),
  submissionStatus: (token: string) => request<SubmissionStatus>(ENDPOINTS.public.status(token)),
  certificateSettings: () => request<CertificateSettingsView>(ENDPOINTS.public.settings),
  recordDownload: (certId: string) => request<void>(ENDPOINTS.public.downloads(certId), { method: 'POST', body: {} }),
  verify: (code: string) => request<VerifyResult>(ENDPOINTS.public.verify(code)),
}

export const authApi = {
  me: () => request<AuthUser>(ENDPOINTS.auth.me),
  login: (body: LoginRequest) => request<AuthUser>(ENDPOINTS.auth.login, { method: 'POST', body }),
  logout: () => request<void>(ENDPOINTS.auth.logout, { method: 'POST', body: {} }),
  changePassword: (body: ChangePasswordRequest) =>
    request<void>(ENDPOINTS.auth.password, { method: 'PATCH', body }),
}

export const adminApi = {
  dashboard: () => request<DashboardStats>(ENDPOINTS.admin.dashboard),
  listResponses: (query: ListResponsesQuery, signal?: AbortSignal) =>
    request<Paginated<ResponseSummary>>(ENDPOINTS.admin.responses, { query: { ...query }, signal }),
  getResponse: (certId: string) => request<ResponseDetail>(ENDPOINTS.admin.response(certId)),
  deleteResponse: (certId: string) => request<void>(ENDPOINTS.admin.response(certId), { method: 'DELETE' }),
  recordDownload: (certId: string) =>
    request<void>(ENDPOINTS.admin.responseDownloads(certId), { method: 'POST', body: {} }),
  verify: (q: string) => request<VerifyResult>(ENDPOINTS.admin.verify, { query: { q } }),
  pendingCount: () => request<{ pending: number; updates: number }>(ENDPOINTS.admin.pendingCount),
  approveUpdate: (certId: string) =>
    request<{ updated: number }>(ENDPOINTS.admin.approveUpdate(certId), { method: 'POST', body: {} }),
  rejectUpdate: ({ certId, reason }: { certId: string; reason?: string }) =>
    request<{ updated: number }>(ENDPOINTS.admin.rejectUpdate(certId), { method: 'POST', body: { reason } }),
  approve: (certIds: string[]) =>
    request<{ updated: number }>(ENDPOINTS.admin.approve, { method: 'POST', body: { certIds } }),
  reject: ({ certId, reason }: { certId: string; reason?: string }) =>
    request<{ updated: number }>(ENDPOINTS.admin.reject(certId), { method: 'POST', body: { reason } }),
  notificationEmails: () => request<NotificationEmails>(ENDPOINTS.admin.notificationEmails),
  saveNotificationEmails: (emails: string[]) =>
    request<NotificationEmails>(ENDPOINTS.admin.notificationEmails, { method: 'PUT', body: { emails } }),
  sendTestNotification: () =>
    request<{ sent: string[]; failed: string[] }>(ENDPOINTS.admin.notificationTest, { method: 'POST', body: {} }),
  roster: () => request<RosterEntry[]>(ENDPOINTS.admin.roster),
  addToRoster: (entries: RosterEntryInput[]) =>
    request<RosterAddResult>(ENDPOINTS.admin.roster, { method: 'POST', body: { entries } }),
  removeFromRoster: (id: string) => request<void>(ENDPOINTS.admin.rosterEntry(id), { method: 'DELETE' }),
  clearRoster: () => request<{ removed: number }>(ENDPOINTS.admin.roster, { method: 'DELETE' }),
  saveSettings: (body: CertificateSettings) =>
    request<CertificateSettingsView>(ENDPOINTS.admin.settings, { method: 'PUT', body }),
  /** A plain link — the browser downloads it with the session cookie. */
  exportCsvUrl: (filters: ResponseFilters) => withQuery(ENDPOINTS.admin.exportCsv, { ...filters }),
}

export { ApiError, errorMessage, isUnauthorized } from './http'
