import { App, Input } from 'antd'
import { useCallback, useRef } from 'react'
import { errorMessage } from '@/api'
import { useApproveResponses, useApproveUpdate, useRejectResponse, useRejectUpdate } from '@/hooks/queries/admin'
import type { ResponseSummary } from '@/types'

type Reviewable = Pick<ResponseSummary, 'certId' | 'name' | 'status'>

/**
 * Approve / reject with confirmation and feedback toasts. Shared by the
 * Responses table, the row menu, the details drawer and the detail page.
 */
export function useReviewActions() {
  const { message, modal } = App.useApp()
  const approveMutation = useApproveResponses()
  const rejectMutation = useRejectResponse()
  const approveUpdateMutation = useApproveUpdate()
  const rejectUpdateMutation = useRejectUpdate()
  const reasonRef = useRef('')

  /** Confirm dialog with an optional reason box; resolves once `submit` succeeds. */
  const confirmWithReason = useCallback(
    (options: {
      title: string
      okText: string
      explanation: string
      submit: (reason: string | undefined) => Promise<unknown>
      success: string
      onDone?: () => void
    }) => {
      reasonRef.current = ''
      modal.confirm({
        title: options.title,
        icon: null,
        okText: options.okText,
        okButtonProps: { danger: true },
        content: (
          <div className="mt-2 flex flex-col gap-2">
            <p className="m-0 text-sm text-slate-500">{options.explanation}</p>
            <Input.TextArea
              autoFocus
              rows={3}
              maxLength={300}
              showCount
              placeholder="Reason shown to the participant (optional), e.g. Name is misspelled"
              onChange={(e) => {
                reasonRef.current = e.target.value
              }}
            />
          </div>
        ),
        onOk: () =>
          options
            .submit(reasonRef.current.trim() || undefined)
            .then(() => {
              message.success(options.success)
              options.onDone?.()
            })
            .catch((error: unknown) => {
              message.error(errorMessage(error))
              throw error
            }),
      })
    },
    [message, modal],
  )

  const approve = useCallback(
    (records: Reviewable[], onDone?: () => void) => {
      const targets = records.filter((r) => r.status !== 'approved')
      if (!targets.length) return
      approveMutation.mutate(
        targets.map((r) => r.certId),
        {
          onSuccess: ({ updated }) => {
            message.success(
              updated === 1
                ? `Approved ${targets[0]!.name}’s certificate.`
                : `Approved ${updated} certificates. Participants with an email address are notified.`,
            )
            onDone?.()
          },
          onError: (error) => message.error(errorMessage(error)),
        },
      )
    },
    [approveMutation, message],
  )

  /** Reject a pending response, or revoke an approved certificate. */
  const reject = useCallback(
    (record: Reviewable, onDone?: () => void) => {
      const revoking = record.status === 'approved'
      confirmWithReason({
        title: revoking ? `Revoke ${record.name}’s certificate?` : `Reject ${record.name}’s submission?`,
        okText: revoking ? 'Revoke certificate' : 'Reject',
        explanation: revoking
          ? 'The certificate will stop verifying. The participant is told by email and can submit the form again.'
          : 'The participant is told by email and can submit the form again.',
        submit: (reason) => rejectMutation.mutateAsync({ certId: record.certId, reason }),
        success: revoking ? `Revoked ${record.name}’s certificate.` : `Rejected ${record.name}’s submission.`,
        onDone,
      })
    },
    [confirmWithReason, rejectMutation],
  )

  /** Apply the participant's requested changes to their certificate. */
  const approveUpdate = useCallback(
    (record: Reviewable, onDone?: () => void) =>
      approveUpdateMutation.mutate(record.certId, {
        onSuccess: () => {
          message.success(`Updated ${record.name}’s certificate. They’ve been emailed.`)
          onDone?.()
        },
        onError: (error) => message.error(errorMessage(error)),
      }),
    [approveUpdateMutation, message],
  )

  /** Turn down the requested changes; the approved certificate stays as it is. */
  const rejectUpdate = useCallback(
    (record: Reviewable, onDone?: () => void) =>
      confirmWithReason({
        title: `Reject ${record.name}’s update request?`,
        okText: 'Reject update',
        explanation: 'Their current certificate stays valid and unchanged. They are told by email.',
        submit: (reason) => rejectUpdateMutation.mutateAsync({ certId: record.certId, reason }),
        success: `Rejected ${record.name}’s update request.`,
        onDone,
      }),
    [confirmWithReason, rejectUpdateMutation],
  )

  return {
    approve,
    reject,
    approveUpdate,
    rejectUpdate,
    approving: approveMutation.isPending,
    approvingUpdate: approveUpdateMutation.isPending,
  }
}
