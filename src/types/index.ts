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
  email: string
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

export type ApprovalStatus = 'pending' | 'approved' | 'rejected'

/**
 * The participant's view of their submission (POST /api/responses and the
 * private status link). The certificate only appears once approved.
 */
export interface SubmissionStatus {
  accessToken: string
  status: ApprovalStatus
  name: string
  opco: string
  submittedAt: string
  reviewedAt: string | null
  rejectionReason: string | null
  certificate: CertificateRecord | null
  /** The participant's most recent update request, if any. */
  update: {
    status: ApprovalStatus
    requestedAt: string
    reviewedAt: string | null
    rejectionReason: string | null
  } | null
}

/**
 * Result of POST /api/responses. One email = one certificate: a repeat
 * submission never creates a second one, and its private link is only emailed.
 */
export interface SubmitResult {
  /** created: first submission · resubmitted: replaced a not-yet-approved one · update_requested: changes await approval. */
  outcome: 'created' | 'resubmitted' | 'update_requested'
  /** Only for `created`. */
  submission: SubmissionStatus | null
}

/** A pending change to an approved response. */
export interface UpdateRequestView {
  id: string
  name: string
  opco: string
  consent: ConsentValue
  answers: AnswerMap
  requestedAt: string
}

export interface ResponseSummary {
  certId: string
  name: string
  email: string | null
  opco: string
  consent: ConsentValue
  answers: AnswerMap
  submittedAt: string
  status: ApprovalStatus
  reviewedAt: string | null
  /** Approved automatically because the participant is on the participant list. */
  autoApproved: boolean
  rejectionReason: string | null
  /** The participant has asked to change their approved details. */
  pendingUpdate: boolean
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
  /** Admin who approved or rejected it (null when automatic or not yet reviewed). */
  reviewedBy: string | null
  /** The pending update request, with the details the participant wants. */
  updateRequest: UpdateRequestView | null
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
  approval?: ApprovalStatus
  /** Only responses with a pending update request. */
  updates?: 'pending'
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
  match: {
    certId: string
    name: string
    opco: string
    submittedAt: string
    verificationCode: string
    /** Public lookups only ever return approved certificates. */
    status: ApprovalStatus
  } | null
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
  totals: {
    responses: number
    approved: number
    pending: number
    rejected: number
    updateRequests: number
    consented: number
    certificatesDownloaded: number
    downloadEvents: number
  }
  byDay: { date: string; count: number }[]
  byOpco: { opco: string; count: number }[]
  questions: QuestionStats[]
  recent: ResponseSummary[]
}

// ---- admin notification emails -------------------------------------------------------

export interface NotificationEmails {
  /** Saved in the dashboard. */
  emails: string[]
  /** From the server's ADMIN_NOTIFY_EMAILS, used only while `emails` is empty. */
  fallback: string[]
  /** False when the server can't send email (no AWS keys). */
  emailEnabled: boolean
}

// ---- participant list (auto-approval) -------------------------------------------------

export interface RosterEntry {
  id: string
  name: string
  email: string | null
  createdAt: string
}

export interface RosterEntryInput {
  name?: string
  email?: string
}

export interface RosterAddResult {
  added: number
  skipped: number
  /** Pending submissions approved because they now match the list. */
  approved: number
}

// ---- UI ---------------------------------------------------------------------------

export type CertificateVariant = 'submitted' | 'returning' | 'admin'
