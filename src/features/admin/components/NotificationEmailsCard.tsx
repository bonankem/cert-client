import { BellOutlined, MailOutlined, PlusOutlined, SendOutlined } from '@ant-design/icons'
import { Alert, App, Button, Card, Flex, Input, Skeleton, Tag, Typography } from 'antd'
import { useState } from 'react'
import { errorMessage } from '@/api'
import { useNotificationEmails, useSaveNotificationEmails, useSendTestNotification } from '@/hooks/queries/admin'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX = 20

/**
 * Admin addresses emailed when a certificate is waiting for approval or a
 * participant asks to update an approved one. Several can be added.
 */
export default function NotificationEmailsCard() {
  const { message } = App.useApp()
  const query = useNotificationEmails()
  const save = useSaveNotificationEmails()
  const test = useSendTestNotification()
  /** Unsaved edits; null means "showing the saved list". */
  const [edited, setEdited] = useState<string[] | null>(null)
  const [draft, setDraft] = useState('')
  const [error, setError] = useState<string | null>(null)

  const saved = query.data?.emails ?? []
  const emails = edited ?? saved
  const setEmails = (update: string[] | ((list: string[]) => string[])) =>
    setEdited(typeof update === 'function' ? update(emails) : update)
  const dirty = emails.length !== saved.length || emails.some((e, i) => e !== saved[i])

  /** Add one or more addresses (comma, semicolon or space separated). */
  const add = () => {
    const candidates = draft
      .split(/[\s,;]+/)
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean)
    if (!candidates.length) return
    const invalid = candidates.find((e) => !EMAIL.test(e))
    if (invalid) return setError(`“${invalid}” is not a valid email address.`)
    const next = [...emails, ...candidates.filter((e) => !emails.includes(e))]
    if (next.length > MAX) return setError(`Add at most ${MAX} addresses.`)
    setEmails(Array.from(new Set(next)))
    setDraft('')
    setError(null)
  }

  const handleSave = () =>
    save.mutate(emails, {
      onSuccess: (result) => {
        setEdited(null)
        message.success(
          result.emails.length
            ? `Saved. ${result.emails.length} address${result.emails.length === 1 ? '' : 'es'} will be notified.`
            : 'Saved. Admin notifications are off.',
        )
      },
      onError: (err) => message.error(errorMessage(err)),
    })

  const handleTest = () =>
    test.mutate(undefined, {
      onSuccess: ({ sent, failed }) => {
        if (!sent.length && !failed.length) message.warning('Nobody to send to. Add an address and save first.')
        else if (failed.length) message.error(`Couldn’t send to ${failed.join(', ')}.${sent.length ? ` Sent to ${sent.join(', ')}.` : ''}`)
        else message.success(`Test email sent to ${sent.join(', ')}.`)
      },
      onError: (err) => message.error(errorMessage(err)),
    })

  const fallback = query.data?.fallback ?? []

  return (
    <Card
      title={
        <span className="flex items-center gap-2">
          <BellOutlined className="text-[#0072ce]" />
          Admin notification emails
        </span>
      }
    >
      {query.isPending ? (
        <Skeleton active paragraph={{ rows: 3 }} />
      ) : query.isError ? (
        <Alert type="error" showIcon title={errorMessage(query.error)} />
      ) : (
        <Flex vertical gap={14}>
          <Typography.Paragraph type="secondary" className="mb-0!">
            These addresses get an email whenever a certificate is waiting for approval or a participant asks to update
            an approved one. Add as many as you need (up to {MAX}).
          </Typography.Paragraph>

          {!query.data?.emailEnabled && (
            <Alert
              type="warning"
              showIcon
              title="Email sending is not set up on the server"
              description="Nothing will be sent until the AWS email keys are configured."
            />
          )}

          <div className="flex min-h-11 flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2 dark:border-white/10 dark:bg-white/5">
            {emails.length ? (
              emails.map((email) => (
                <Tag
                  key={email}
                  closable
                  icon={<MailOutlined />}
                  onClose={(e) => {
                    e.preventDefault()
                    setEmails((list) => list.filter((x) => x !== email))
                  }}
                  className="m-0! flex items-center py-1 text-[13px]"
                >
                  {email}
                </Tag>
              ))
            ) : (
              <span className="px-1 text-sm text-slate-400">
                No addresses yet
                {fallback.length ? ` — using ${fallback.join(', ')} from the server settings` : ' — admin notifications are off'}
              </span>
            )}
          </div>

          <div>
            <Flex gap={8}>
              <Input
                size="small"
                value={draft}
                status={error ? 'error' : undefined}
                placeholder="name@zoracom.com (separate several with commas)"
                prefix={<MailOutlined className="text-slate-400" />}
                onChange={(e) => {
                  setDraft(e.target.value)
                  if (error) setError(null)
                }}
                onPressEnter={add}
              />
              <Button size="small" icon={<PlusOutlined />} onClick={add} disabled={!draft.trim()}>
                Add
              </Button>
            </Flex>
            {error && <div className="mt-1 text-xs text-red-500">{error}</div>}
          </div>

          <Flex gap={8} wrap justify="space-between" align="center">
            <Button
              size="small"
              icon={<SendOutlined />}
              loading={test.isPending}
              disabled={dirty || (!saved.length && !fallback.length) || !query.data?.emailEnabled}
              title={dirty ? 'Save your changes first' : undefined}
              onClick={handleTest}
            >
              Send test email
            </Button>
            <Flex gap={8}>
              {dirty && (
                <Button size="small" onClick={() => setEdited(null)}>
                  Discard
                </Button>
              )}
              <Button size="small" type="primary" disabled={!dirty} loading={save.isPending} onClick={handleSave}>
                Save addresses
              </Button>
            </Flex>
          </Flex>
        </Flex>
      )}
    </Card>
  )
}
