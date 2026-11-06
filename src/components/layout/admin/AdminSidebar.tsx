import {
  DashboardOutlined,
  FileDoneOutlined,
  LeftOutlined,
  LogoutOutlined,
  RightOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  TableOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Tooltip } from 'antd'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import BrandLogo from '@/components/common/BrandLogo'
import { ROUTES } from '@/config/routes'
import { useLogout, useMe } from '@/hooks/queries/auth'

export interface NavItem {
  path: string
  label: string
  description?: string
  icon: typeof DashboardOutlined
}

export const ADMIN_SIDEBAR_NAV: NavItem[] = [
  { path: ROUTES.admin.dashboard, label: 'Dashboard', description: 'Overview & metrics', icon: DashboardOutlined },
  { path: ROUTES.admin.responses, label: 'Responses', description: 'Participant feedback', icon: TableOutlined },
  { path: ROUTES.admin.certificates, label: 'Certificates', description: 'Generation & list', icon: FileDoneOutlined },
  { path: ROUTES.admin.verify, label: 'Verify', description: 'Check certificates', icon: SafetyCertificateOutlined },
  { path: ROUTES.admin.settings, label: 'Settings', description: 'Trainer & signature', icon: SettingOutlined },
]

interface AdminSidebarProps {
  collapsed: boolean
  onToggleCollapse: () => void
  onNavigate?: () => void
  className?: string
}

const initials = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

/**
 * Standard, editable Admin Sidebar Component.
 * Styled with an airy light aesthetic featuring a delicate gradient with primary blue,
 * while preserving high-contrast sleek styling in dark mode.
 */
export default function AdminSidebar({
  collapsed,
  onToggleCollapse,
  onNavigate,
  className = '',
}: AdminSidebarProps) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const user = useMe().data
  const logout = useLogout()

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSettled: () => navigate(ROUTES.admin.login, { replace: true }),
    })
  }

  return (
    <aside
      className={`relative flex flex-col transition-all duration-300 ease-in-out border-r select-none ${
        collapsed ? 'w-18' : 'w-64'
      } bg-gradient-to-b from-white via-[#f0f7ff] to-[#e6f2fc] border-slate-200/90 text-slate-800 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-900 dark:border-zinc-800/80 dark:text-zinc-100 ${className}`}
    >
      {/* 1. Brand & Header Area */}
      <div className="flex h-16 items-center justify-between border-b border-slate-200/80 dark:border-zinc-800/80 px-4">
        <Link
          to={ROUTES.admin.dashboard}
          onClick={onNavigate}
          className="flex items-center gap-3 min-w-0"
          aria-label="Admin Dashboard"
        >
          <BrandLogo name={collapsed ? 'mark' : 'zoracom'} className={collapsed ? 'h-7 w-7' : 'h-5'} />
          {!collapsed && (
            <div className="min-w-0 flex flex-col">
              <span className="truncate text-sm font-bold tracking-tight text-slate-900 dark:text-white">
                StableNet Admin
              </span>
              <span className="truncate text-[11px] font-semibold text-[#0072ce] dark:text-sky-400">
                MTN Cameroon
              </span>
            </div>
          )}
        </Link>

        {/* Desktop Collapse Toggle */}
        <button
          type="button"
          onClick={onToggleCollapse}
          className="hidden lg:flex size-7 items-center justify-center rounded-lg text-slate-400 hover:text-slate-800 hover:bg-blue-100/60 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800/80 transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <RightOutlined className="text-xs" /> : <LeftOutlined className="text-xs" />}
        </button>
      </div>

      {/* 2. Navigation Items */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
        <div
          className={`px-3 pb-2 text-[10px] font-bold tracking-wider text-slate-400 dark:text-zinc-500 uppercase ${
            collapsed ? 'sr-only' : 'block'
          }`}
        >
          Navigation
        </div>

        {ADMIN_SIDEBAR_NAV.map((item) => {
          const Icon = item.icon
          const isActive =
            pathname === item.path ||
            (item.path !== ROUTES.admin.dashboard && pathname.startsWith(item.path))

          const linkContent = (
            <Link
              key={item.path}
              to={item.path}
              onClick={onNavigate}
              className={`group flex items-center gap-3 px-3 py-2 rounded-lg text-xs sm:text-[13px] font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600/12 via-blue-500/8 to-sky-400/5 text-[#0072ce] font-semibold border-l-[3px] border-[#0072ce] shadow-2xs dark:from-sky-500/20 dark:to-sky-500/5 dark:text-sky-400 dark:border-sky-400'
                  : 'text-slate-600 hover:bg-white/80 hover:text-slate-900 border-l-[3px] border-transparent dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100'
              } ${collapsed ? 'justify-center px-0' : ''}`}
            >
              <Icon
                className={`text-sm sm:text-base shrink-0 transition-transform group-hover:scale-110 ${
                  isActive
                    ? 'text-[#0072ce] dark:text-sky-400'
                    : 'text-slate-400 group-hover:text-[#0072ce] dark:text-zinc-400 dark:group-hover:text-zinc-200'
                }`}
              />
              {!collapsed && (
                <div className="min-w-0 flex-1 truncate">
                  <div className="leading-tight">{item.label}</div>
                  {item.description && (
                    <div
                      className={`text-[10px] font-normal truncate mt-0.5 ${
                        isActive ? 'text-blue-600/80 dark:text-sky-400/70' : 'text-slate-400 dark:text-zinc-500'
                      }`}
                    >
                      {item.description}
                    </div>
                  )}
                </div>
              )}
            </Link>
          )

          if (collapsed) {
            return (
              <Tooltip key={item.path} title={item.label} placement="right">
                {linkContent}
              </Tooltip>
            )
          }

          return linkContent
        })}
      </nav>

      {/* 3. Footer / User Profile & Logout */}
      <div className="border-t border-slate-200/80 dark:border-zinc-800/80 p-3">
        {user ? (
          <div
            className={`flex items-center gap-2.5 rounded-lg bg-white/90 border border-slate-200/90 shadow-2xs p-2 dark:bg-zinc-900/80 dark:border-zinc-800/60 ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            <Link
              to={ROUTES.admin.account}
              onClick={onNavigate}
              className="flex items-center gap-2.5 min-w-0 flex-1 group"
              title="View account"
            >
              <div className="size-7.5 shrink-0 rounded-full bg-gradient-to-tr from-[#0072ce] to-[#00a9e8] flex items-center justify-center text-xs font-bold text-white shadow-xs">
                {initials(user.name)}
              </div>
              {!collapsed && (
                <div className="min-w-0 flex-1 truncate text-left">
                  <div className="truncate text-xs font-semibold text-slate-800 group-hover:text-[#0072ce] dark:text-zinc-100 dark:group-hover:text-sky-400 transition-colors">
                    {user.name}
                  </div>
                  <div className="truncate text-[10px] text-slate-500 dark:text-zinc-400">
                    {user.email}
                  </div>
                </div>
              )}
            </Link>

            {!collapsed && (
              <button
                type="button"
                onClick={handleLogout}
                className="size-7 shrink-0 rounded-md flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:text-rose-400 dark:hover:bg-rose-500/10 transition-colors"
                title="Log out"
                aria-label="Log out"
              >
                <LogoutOutlined className="text-xs" />
              </button>
            )}
          </div>
        ) : (
          <Link
            to={ROUTES.admin.account}
            className={`flex items-center gap-2 text-xs text-slate-500 hover:text-slate-900 p-2 dark:text-zinc-400 dark:hover:text-white ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            <UserOutlined />
            {!collapsed && <span>Account</span>}
          </Link>
        )}
      </div>
    </aside>
  )
}
