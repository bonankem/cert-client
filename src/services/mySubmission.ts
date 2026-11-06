import { STORAGE_KEYS } from '@/config/constants'
import type { SubmittedResponse } from '@/types'
import { createWebStore } from './webStore'

/** The participant's own submission, so they can re-open their certificate on this device. */
export const mySubmissionStore = createWebStore<SubmittedResponse | null>(STORAGE_KEYS.mySubmission, null)

export function rememberSubmission(record: SubmittedResponse): void {
  try {
    mySubmissionStore.set(record)
  } catch {
    /* storage unavailable — the certificate still shows this time */
  }
}

/** Ignore records saved by older versions (before codes came from the server). */
export const isValidSubmission = (value: SubmittedResponse | null): value is SubmittedResponse =>
  !!value?.name && !!value.certId && !!value.verificationCode
