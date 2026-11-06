import { useCallback, useState } from 'react'
import type { CertificateRecord, CertificateSettings, CertificateVariant } from '@/types'

export interface CertificateDialogOptions {
  variant?: CertificateVariant
  note?: string | null
  /** Draw with these settings instead of the saved ones (used for previews). */
  settings?: CertificateSettings
}

interface DialogState {
  open: boolean
  record: CertificateRecord | null
  variant: CertificateVariant
  note: string | null
  settings?: CertificateSettings
}

const INITIAL: DialogState = { open: false, record: null, variant: 'submitted', note: null }

/**
 * State for <CertificateModal>. The record is kept after closing so the
 * modal can animate out with its content intact.
 */
export function useCertificateDialog() {
  const [state, setState] = useState<DialogState>(INITIAL)

  const show = useCallback((record: CertificateRecord, options: CertificateDialogOptions = {}) => {
    setState({
      open: true,
      record,
      variant: options.variant ?? 'submitted',
      note: options.note ?? null,
      settings: options.settings,
    })
  }, [])

  const close = useCallback(() => setState((prev) => ({ ...prev, open: false })), [])

  return { ...state, show, close }
}

export type CertificateDialog = ReturnType<typeof useCertificateDialog>
