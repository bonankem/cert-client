import {
  CheckCircleOutlined,
  DashboardOutlined,
  FileDoneOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  TableOutlined,
  TeamOutlined,
  ToolOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Button, Card } from 'antd'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import AdminPageHeader from '@/components/layout/AdminPageHeader'
import { ROUTES } from '@/config/routes'

/* ---------------------------------------------------------------------------------------------
 * Admin how-to guide. Keep in step with the shared admin guide document when features change.
 * ------------------------------------------------------------------------------------------- */

const origin = typeof window === 'undefined' ? '' : window.location.origin

interface Section {
  id: string
  title: string
  icon: ReactNode
  /** Admin page this section is about (shows an "Open" button). */
  to?: string
  body: ReactNode
}

const B = ({ children }: { children: ReactNode }) => (
  <strong className="font-semibold text-slate-900 dark:text-slate-100">{children}</strong>
)

const Mono = ({ children }: { children: ReactNode }) => (
  <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[0.85em] text-slate-800 dark:bg-white/10 dark:text-slate-200">
    {children}
  </code>
)

const Steps = ({ items }: { items: ReactNode[] }) => (
  <ol className="m-0 flex list-none flex-col gap-2.5 p-0">
    {items.map((item, i) => (
      <li key={i} className="flex gap-3">
        <span className="mt-0.5 flex size-5.5 shrink-0 items-center justify-center rounded-full bg-[#0072ce]/10 text-[11px] font-bold text-[#0072ce] dark:bg-sky-400/15 dark:text-sky-300">
          {i + 1}
        </span>
        <span className="min-w-0">{item}</span>
      </li>
    ))}
  </ol>
)

const Bullets = ({ items }: { items: ReactNode[] }) => (
  <ul className="m-0 flex list-disc flex-col gap-2 pl-5 marker:text-slate-400">
    {items.map((item, i) => (
      <li key={i}>{item}</li>
    ))}
  </ul>
)

const Table = ({ head, rows }: { head: [string, string]; rows: [ReactNode, ReactNode][] }) => (
  <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-white/10">
    <table className="w-full border-collapse text-left text-[13px]">
      <thead className="bg-slate-50 text-slate-500 dark:bg-white/5 dark:text-slate-400">
        <tr>
          {head.map((h) => (
            <th key={h} className="px-3 py-2 font-semibold">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map(([a, b], i) => (
          <tr key={i} className="border-t border-slate-200 align-top dark:border-white/10">
            <td className="w-[38%] px-3 py-2 font-medium text-slate-900 dark:text-slate-100">{a}</td>
            <td className="px-3 py-2">{b}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

const Note = ({ children, tone = 'info' }: { children: ReactNode; tone?: 'info' | 'warn' }) => (
  <p
    className={`m-0 rounded-lg border px-3 py-2 text-[13px] ${
      tone === 'warn'
        ? 'border-amber-300/60 bg-amber-50 text-amber-900 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-200'
        : 'border-sky-200 bg-sky-50 text-sky-900 dark:border-sky-400/25 dark:bg-sky-400/10 dark:text-sky-200'
    }`}
  >
    {children}
  </p>
)

const SECTIONS: Section[] = [
  {
    id: 'setup',
    title: 'Before you share the form',
    icon: <SettingOutlined />,
    to: ROUTES.admin.settings,
    body: (
      <>
        <p className="m-0">
          Do this once, before sending the form link. Everything here is printed on every participant’s certificate.
        </p>
        <Steps
          items={[
            <>
              Open <B>Settings</B> in the left-hand menu.
            </>,
            <>
              Enter the <B>Trainer’s full name</B> exactly as it should appear under the signature, e.g. “Engr. John Doe”.
            </>,
            <>
              Pick the <B>Training start date</B> and <B>Training end date</B>.
            </>,
            <>
              Upload the <B>Trainer signature image</B> (PNG, JPG or WebP). A PNG with a transparent background looks best.
            </>,
            <>
              Preview the <B>Minimalist</B> and <B>Styled</B> designs, and click <B>Set as Active Design</B> on the one
              participants should receive.
            </>,
            <>
              Click <B>Save Active Template &amp; Details</B>.
            </>,
          ]}
        />
        <Note>
          You can change these at any time. Certificates downloaded after a change, including re-downloads, show the
          new details.
        </Note>
      </>
    ),
  },
  {
    id: 'participants',
    title: 'What participants see',
    icon: <TeamOutlined />,
    body: (
      <>
        <p className="m-0">
          Share <Mono>{origin}/</Mono>. The form takes about two minutes on a phone or computer, with no account needed.
        </p>
        <Steps
          items={[
            <>
              <B>About you:</B> full name exactly as it should be printed, and their MTN OpCo.
            </>,
            'One answer for each training question.',
            <>
              <B>Success story:</B> whether their feedback may be used as a success story.
            </>,
            <>
              <B>Submit</B>: the certificate opens straight away, ready to download as a PDF.
            </>,
            'Returning later on the same device and browser shows a banner to download it again.',
          ]}
        />
        <Note>
          On another device the banner does not appear. Download the certificate for them from <B>Certificates</B>.
        </Note>
      </>
    ),
  },
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: <DashboardOutlined />,
    to: ROUTES.admin.dashboard,
    body: (
      <>
        <p className="m-0">How the training landed. It refreshes itself every minute.</p>
        <Table
          head={['Item', 'What it shows']}
          rows={[
            ['Responses', 'Total submissions and how many OpCos they came from'],
            ['Rated training highly', 'Share choosing one of the two best answers to the overall rating question'],
            ['Certificates downloaded', 'Share who downloaded their own certificate (admin downloads not counted)'],
            ['Consented to story', 'Share who agreed their feedback may be used as a success story'],
            ['Responses per day', 'Submissions per day, in UTC (GMT)'],
            ['Responses by OpCo', 'How responses split across MTN operating companies'],
            ['Feedback breakdown', 'How participants answered each question'],
            ['Recent responses', 'The latest submissions; click one to open it'],
          ]}
        />
        <p className="m-0">
          Each chart can switch to a table view. <B>Export CSV</B> downloads every response as a spreadsheet for Excel.
        </p>
      </>
    ),
  },
  {
    id: 'responses',
    title: 'Responses',
    icon: <TableOutlined />,
    to: ROUTES.admin.responses,
    body: (
      <>
        <Bullets
          items={[
            <>
              <B>Search</B> by name, OpCo or certificate ID.
            </>,
            <>
              <B>Filter</B> with the funnel icons in the <B>OpCo</B> and <B>Consent</B> column headers.
            </>,
            <>
              <B>Quick look:</B> click a row to open a side panel with the answers and certificate.
            </>,
            <>
              <B>Full page:</B> click the participant’s name for the full response and download history.
            </>,
            <>
              <B>Download</B> a certificate from the row’s <B>⋮</B> menu, in either design.
            </>,
            <>
              <B>Export CSV</B> downloads only what is currently shown, so filter first to export one OpCo.
            </>,
          ]}
        />
        <Note tone="warn">
          <B>Delete</B> is on the full response page. It cannot be undone, and that certificate stops verifying. Use it
          only for test or duplicate entries.
        </Note>
      </>
    ),
  },
  {
    id: 'certificates',
    title: 'Certificates',
    icon: <FileDoneOutlined />,
    to: ROUTES.admin.certificates,
    body: (
      <Bullets
        items={[
          <>
            Switch between <B>All</B>, <B>Downloaded</B> and <B>Not downloaded</B> to see who still needs a reminder.
          </>,
          <>
            <B>Search</B> by name, OpCo or certificate ID.
          </>,
          <>
            Use the <B>⋮</B> menu to view details or download a certificate on the participant’s behalf, in either
            design. Your downloads are logged separately and never count as the participant’s.
          </>,
          <>
            The tag at the top right shows the active design; <B>Change Design</B> opens Settings.
          </>,
        ]}
      />
    ),
  },
  {
    id: 'verify',
    title: 'Verifying certificates',
    icon: <SafetyCertificateOutlined />,
    to: ROUTES.admin.verify,
    body: (
      <>
        <p className="m-0">Every certificate is checked against the database, so a forged or edited one shows as not valid.</p>
        <Table
          head={['Identifier', 'Example']}
          rows={[
            [
              'Certificate ID (ZC-STN-date-4 characters)',
              <Mono key="id">ZC-STN-261105-K7Q2</Mono>,
            ],
            ['Verification code (3 × 4 characters)', <Mono key="code">7KQ2-M9XA-T4PZ</Mono>],
          ]}
        />
        <Bullets
          items={[
            <>
              <B>As an admin:</B> open <B>Verify</B>, paste either identifier and click <B>Verify</B>. <B>Open</B> goes
              to the full response.
            </>,
            <>
              <B>Anyone else:</B> scan the certificate’s QR code, or go to <Mono>{origin}/verify</Mono>. No sign-in
              needed.
            </>,
          ]}
        />
        <p className="m-0">
          Codes never use 0, O, 1, I or L, so they are easy to read aloud. A deleted response no longer verifies.
        </p>
      </>
    ),
  },
  {
    id: 'account',
    title: 'Your account',
    icon: <UserOutlined />,
    to: ROUTES.admin.account,
    body: (
      <Bullets
        items={[
          <>
            <B>Change password:</B> your avatar (top right) → <B>Account Settings</B>. Enter the current password and
            the new one twice (at least 10 characters). Other devices are signed out.
          </>,
          'Sessions last 12 hours, then you sign in again.',
          <>
            <B>Sign out</B> from the same menu or the bottom of the sidebar.
          </>,
        ]}
      />
    ),
  },
  {
    id: 'troubleshooting',
    title: 'Troubleshooting',
    icon: <ToolOutlined />,
    body: (
      <Table
        head={['Situation', 'What to do']}
        rows={[
          ['First load is slow after a quiet period', 'Wait up to a minute while the server wakes up'],
          ['“Too many requests” when signing in', '10 wrong attempts in 15 minutes pauses sign-in; wait 15 minutes'],
          ['A participant misspelled their name', 'Delete their response and ask them to submit again'],
          ['A participant lost their certificate', 'Download it from Certificates and send it on'],
          ['Old trainer name or dates on certificates', 'Update Settings and save'],
          ['Need a report or backup', 'Export CSV on the Dashboard or Responses page'],
          [
            'Need another admin account',
            <a key="mail" href="mailto:bonaventure@zoracom.com">
              bonaventure@zoracom.com
            </a>,
          ],
        ]}
      />
    ),
  },
]

const jumpTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

export default function HelpPage() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
      <AdminPageHeader
        title="Help"
        description="How to set up certificates, follow responses and verify certificates."
      />

      <Card size="small">
        <div className="flex flex-wrap gap-2">
          {SECTIONS.map((s) => (
            <Button key={s.id} size="small" icon={s.icon} onClick={() => jumpTo(s.id)}>
              {s.title}
            </Button>
          ))}
        </div>
      </Card>

      {SECTIONS.map((s, i) => (
        <Card
          key={s.id}
          id={s.id}
          className="scroll-mt-20"
          title={
            <span className="flex items-center gap-2">
              <span className="text-[#0072ce] dark:text-sky-400">{i === 0 ? <CheckCircleOutlined /> : s.icon}</span>
              {s.title}
            </span>
          }
          extra={
            s.to && (
              <Link to={s.to}>
                <Button size="small" type="link">
                  Open
                </Button>
              </Link>
            )
          }
        >
          <div className="flex flex-col gap-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">{s.body}</div>
        </Card>
      ))}
    </div>
  )
}
