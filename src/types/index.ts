/**
 * Client-side types. API shapes mirror the server's DTOs
 * (server/src/** /*.types.ts) — keep them in sync when the API changes.
 */

// ---- form config (GET /api/form-config) ----------------------------------------

export type SectionId = 'training' | 'stablenet'
export type ConsentValue = 'Yes' | 'No'
export type AnswerMap = Record<string, string>

export interface ChoiceOption<V extends string = string> {
  label: string
  value: V
}

export interface FormSection {
  id: SectionId
  title: string
  lead: string
}

export interface FormQuestion {
  id: string
  section: SectionId
  text: string
  /** Ordered best → worst. */
  options: readonly string[]
  label: string
  csvLabel: string
}

export interface FormConfig {
  sections: FormSection[]
  questions: FormQuestion[]
  opcos: string[]
  defaultOpco: string
  consent: {
    question: string
    disclaimer: string
    options: ChoiceOption<ConsentValue>[]
  }
}

// ---- auth -----------------------------------------------------------------------

export interface AuthUser {
  id: string
  email: string
  name: string
  role: 'ADMIN'
  lastLoginAt: string | null
  token?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

// ---- responses ------------------------------------------------------------------

export interface FeedbackFormValues {
  fullName: string
  opco: string
  consent: ConsentValue
  answers: AnswerMap
}

/** The minimum needed to draw a certificate. */
export interface CertificateRecord {
  name: string
  opco: string
  certId: string
  submittedAt: string
  verificationCode: string
}

/** Returned by POST /api/responses. */
export interface SubmittedResponse extends CertificateRecord {
  consent: ConsentValue
  answers: AnswerMap
}

export interface ResponseSummary {
  certId: string
  name: string
  opco: string
  consent: ConsentValue
  answers: AnswerMap
  submittedAt: string
  /** Downloads by the participant (admin downloads don't count as "received"). */
  participantDownloads: number
  lastDownloadedAt: string | null
}

export type DownloadSource = 'participant' | 'admin'

export interface DownloadEventView {
  id: string
  source: DownloadSource
  downloadedAt: string
  downloadedBy: string | null
}

export interface ResponseDetail extends ResponseSummary {
  verificationCode: string
  downloads: DownloadEventView[]
}

export const PAGE_SIZES = [10, 20, 50, 100] as const
export type PageSize = (typeof PAGE_SIZES)[number]
export type SortField = 'submittedAt' | 'name' | 'participantDownloads' | 'lastDownloadedAt'
export type SortOrder = 'ascend' | 'descend'
export type DownloadStatus = 'downloaded' | 'pending'

export interface ResponseFilters {
  search?: string
  opco?: string[]
  consent?: ConsentValue
  status?: DownloadStatus
}

export interface ListResponsesQuery extends ResponseFilters {
  page: number
  pageSize: PageSize
  sortField: SortField
  sortOrder: SortOrder
}

export interface Paginated<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

export interface VerifyResult {
  match: { certId: string; name: string; opco: string; submittedAt: string; verificationCode: string } | null
}

// ---- certificate settings ---------------------------------------------------------

export type CertificateDesign = 'classic' | 'modern'

export interface CertificateSettings {
  trainerName: string
  legacyDates?: string
  startDate: string
  endDate: string
  signature: string
  designVariant?: CertificateDesign
}

export interface CertificateSettingsView extends CertificateSettings {
  updatedAt: string | null
}

// ---- dashboard ----------------------------------------------------------------------

export interface QuestionStats {
  id: string
  section: SectionId
  label: string
  text: string
  counts: { option: string; count: number }[]
  answered: number
}

export interface DashboardStats {
  totals: { responses: number; consented: number; certificatesDownloaded: number; downloadEvents: number }
  byDay: { date: string; count: number }[]
  byOpco: { opco: string; count: number }[]
  questions: QuestionStats[]
  recent: ResponseSummary[]
}

// ---- UI ---------------------------------------------------------------------------

export type CertificateVariant = 'submitted' | 'returning' | 'admin'
