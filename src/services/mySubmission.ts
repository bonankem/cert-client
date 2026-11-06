import { STORAGE_KEYS } from '@/config/constants'
import type { CertificateRecord, SubmissionStatus } from '@/types'
import { createWebStore } from './webStore'

/** What this device remembers about the participant's own submission. */
export interface MySubmission {
  name: string
  /** Private token behind the status link (every submission since approval was introduced). */
  accessToken?: string
  /** Certificate saved by older versions, which issued it instantly. */
  certificate?: CertificateRecord
}

/** Raw stored value: the current shape, or a bare certificate saved by older versions. */
type Stored = MySubmission | CertificateRecord | null

export const mySubmissionStore = createWebStore<Stored>(STORAGE_KEYS.mySubmission, null)

export function rememberSubmission(status: SubmissionStatus): void {
  try {
    mySubmissionStore.set({ name: status.name, accessToken: status.accessToken })
  } catch {
    /* storage unavailable — the status link in the email still works */
  }
}

export function forgetSubmission(): void {
  try {
    mySubmissionStore.set(null)
  } catch {
    /* storage unavailable */
  }
}

const isLegacyCertificate = (value: object): value is CertificateRecord =>
  'certId' in value && 'verificationCode' in value && 'name' in value

/** Read whatever is stored, upgrading old records; null when nothing usable is there. */
export function readMySubmission(value: Stored): MySubmission | null {
  if (!value || typeof value !== 'object') return null
  if (isLegacyCertificate(value)) {
    return value.certId && value.verificationCode ? { name: value.name, certificate: value } : null
  }
  return value.name && (value.accessToken || value.certificate) ? value : null
}
