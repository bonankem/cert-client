import { DeleteOutlined, UploadOutlined, UserAddOutlined } from '@ant-design/icons'
import { Alert, App, Button, Card, Flex, Input, Popconfirm, Table, Typography, Upload } from 'antd'
import { useMemo, useState } from 'react'
import { errorMessage } from '@/api'
import AdminPageHeader from '@/components/layout/AdminPageHeader'
import { useAddToRoster, useClearRoster, useRemoveFromRoster, useRoster } from '@/hooks/queries/admin'
import type { RosterEntry, RosterEntryInput } from '@/types'
import { formatDateTime } from '@/utils/date'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const HEADER_WORDS = /^(full\s*)?name$|^e-?mail(\s*address)?$/i

/**
 * Turn pasted text or a CSV into entries. Each line may be "Name, email",
 * "email", "Name" or two columns copied from Excel (tab-separated); the
 * column holding an @ is the email, the rest is the name. Header rows are skipped.
 */
function parseParticipants(text: string): RosterEntryInput[] {
  const entries: RosterEntryInput[] = []
  for (const line of text.split(/\r?\n/)) {
    const cells = line
      .split(/[,;\t]/)
      .map((c) => c.trim().replace(/^"(.*)"$/, '$1').trim())
      .filter(Boolean)
    if (!cells.length || cells.every((c) => HEADER_WORDS.test(c))) continue

    const email = cells.find((c) => EMAIL.test(c))
    const name = cells.filter((c) => c !== email && !c.includes('@')).join(' ').replace(/\s+/g, ' ').trim()
    if (email || name) entries.push({ ...(name && { name }), ...(email && { email: email.toLowerCase() }) })
  }
  return entries
}

function AddParticipants() {
  const { message } = App.useApp()
  const add = useAddToRoster()
  const [text, setText] = useState('')
  const parsed = useMemo(() => parseParticipants(text), [text])

  const handleFile = (file: File) => {
    file
      .text()
      .then((content) => setText((prev) => (prev.trim() ? `${prev.trim()}\n${content}` : content)))
      .catch(() => message.error('Couldn’t read that file. Save it as CSV and try again.'))
    return false
  }

  const handleAdd = () =>
    add.mutate(parsed, {
      onSuccess: ({ added, skipped, approved }) => {
        const parts = [`Added ${added} participant${added === 1 ? '' : 's'}`]
        if (skipped) parts.push(`${skipped} already on the list or duplicated`)
        if (approved) parts.push(`${approved} waiting submission${approved === 1 ? '' : 's'} approved`)
        message.success(`${parts.join(' · ')}.`)
        setText('')
      },
      onError: (error) => message.error(errorMessage(error)),
    })

  return (
    <Card title="Add participants">
      <Typography.Paragraph type="secondary" className="mb-3!">
        One person per line: <code>Full name, email</code>, just an email, or just a name. You can paste two columns
        from Excel or upload a CSV file. Email is the most reliable match; names match regardless of word order,
        capitals or accents.
      </Typography.Paragraph>
      <Input.TextArea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={7}
        placeholder={'Jane Doe, jane.doe@mtn.com\njohn.smith@mtn.com\nAmina Bello'}
        className="font-mono text-sm"
      />
      <Flex justify="space-between" align="center" gap={12} wrap className="mt-3">
        <Upload accept=".csv,.txt,text/csv,text/plain" showUploadList={false} beforeUpload={handleFile}>
          <Button size="small" icon={<UploadOutlined />}>
            Upload CSV
          </Button>
        </Upload>
        <Flex align="center" gap={12}>
          <Typography.Text type="secondary" className="text-sm">
            {parsed.length ? `${parsed.length} ready to add` : 'Nothing to add yet'}
          </Typography.Text>
          <Button
            type="primary"
            size="small"
            icon={<UserAddOutlined />}
            disabled={!parsed.length}
            loading={add.isPending}
            onClick={handleAdd}
          >
            Add to list
          </Button>
        </Flex>
      </Flex>
    </Card>
  )
}

function ParticipantList() {
  const { message } = App.useApp()
  const roster = useRoster()
  const remove = useRemoveFromRoster()
  const clear = useClearRoster()
  const [search, setSearch] = useState('')

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase()
    const all = roster.data ?? []
    return term ? all.filter((e) => `${e.name} ${e.email ?? ''}`.toLowerCase().includes(term)) : all
  }, [roster.data, search])

  return (
    <Card
      title={`On the list${roster.data ? ` (${roster.data.length})` : ''}`}
      extra={
        !!roster.data?.length && (
          <Popconfirm
            title="Clear the whole list?"
            description="Already-approved certificates stay approved. New submissions will wait for approval."
            okText="Clear list"
            okButtonProps={{ danger: true, loading: clear.isPending }}
            onConfirm={() =>
              clear.mutate(undefined, {
                onSuccess: ({ removed }) => message.success(`Removed ${removed} participants.`),
                onError: (error) => message.error(errorMessage(error)),
              })
            }
          >
            <Button size="small" danger>
              Clear list
            </Button>
          </Popconfirm>
        )
      }
    >
      {roster.isError ? (
        <Alert type="error" showIcon title={errorMessage(roster.error)} />
      ) : (
        <>
          <Input.Search
            size="small"
            allowClear
            placeholder="Search name or email"
            className="mb-3 max-w-sm"
            onChange={(e) => setSearch(e.target.value)}
          />
          <Table<RosterEntry>
            rowKey="id"
            size="small"
            loading={roster.isPending}
            dataSource={rows}
            pagination={{ pageSize: 20, hideOnSinglePage: true, showSizeChanger: false }}
            scroll={{ x: 'max-content' }}
            locale={{ emptyText: search ? 'No one matches that search.' : 'No participants yet. Add some above.' }}
            columns={[
              { key: 'name', title: 'Name', render: (_, e) => e.name || '—', sorter: (a, b) => a.name.localeCompare(b.name) },
              { key: 'email', title: 'Email', render: (_, e) => e.email ?? '—' },
              { key: 'added', title: 'Added', render: (_, e) => formatDateTime(e.createdAt) },
              {
                key: 'remove',
                title: '',
                width: 56,
                render: (_, e) => (
                  <Popconfirm
                    title="Remove from the list?"
                    okText="Remove"
                    okButtonProps={{ danger: true }}
                    onConfirm={() =>
                      remove.mutate(e.id, { onError: (error) => message.error(errorMessage(error)) })
                    }
                  >
                    <Button type="text" size="small" danger icon={<DeleteOutlined />} aria-label={`Remove ${e.name || e.email}`} />
                  </Popconfirm>
                ),
              },
            ]}
          />
        </>
      )}
    </Card>
  )
}

export default function ParticipantsPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
      <AdminPageHeader
        title="Participants"
        description="People on this list are approved automatically when they submit the form. Everyone else waits for you under Responses."
      />
      <AddParticipants />
      <ParticipantList />
    </div>
  )
}
