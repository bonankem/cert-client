import {
  DownOutlined,
  ExportOutlined,
  LogoutOutlined,
  MenuOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Dropdown } from 'antd'
import type { MenuProps } from 'antd'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import ThemeSwitcher from '@/components/common/ThemeSwitcher'
import { ROUTES } from '@/config/routes'
import { useLogout, useMe } from '@/hooks/queries/auth'
import { ADMIN_SIDEBAR_NAV } from './AdminSidebar'

interface AdminHeaderProps {
  onOpenMobileNav: () => void
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
 * Standard, editable Admin Header Component.
 * Clean, luminous light mode with crisp typography and subtle borders,
 * preserving sleek dark styling in dark mode.
 */
export default function AdminHeader({ onOpenMobileNav, className = '' }: AdminHeaderProps) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const user = useMe().data
  const logout = useLogout()

  const currentNav = ADMIN_SIDEBAR_NAV.find((item) =>
    item.path === ROUTES.admin.dashboard
      ? pathname === item.path
      : pathname.startsWith(item.path),
  )

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSettled: () => navigate(ROUTES.admin.login, { replace: true }),
    })
  }

  const accountMenuItems: MenuProps['items'] = [
    {
      key: 'user-info',
      disabled: true,
      label: (
        <div className="py-1 cursor-default">
          <div className="font-semibold text-slate-900 dark:text-slate-100">{user?.name}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</div>
        </div>
      ),
    },
    { type: 'divider' },
    {
      key: 'account',
      icon: <UserOutlined />,
      label: <Link to={ROUTES.admin.account}>Account Settings</Link>,
    },
    {
      key: 'public-form',
      icon: <ExportOutlined />,
      label: (
        <a href="/" target="_blank" rel="noopener noreferrer">
          View Public Form
        </a>
      ),
    },
    { type: 'divider' },
    {
      key: 'logout',
      icon: <LogoutOutlined className="text-red-500!" />,
      danger: true,
      label: 'Log out',
      onClick: handleLogout,
    },
  ]

  return (
    <header
      className={`sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b px-3 sm:px-6 transition-colors backdrop-blur-md bg-white/95 border-slate-200/90 text-slate-800 dark:bg-zinc-950 dark:border-zinc-800/80 dark:text-white ${className}`}
    >
      {/* Left Zone: Mobile hamburger + Breadcrumb */}
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={onOpenMobileNav}
          className="flex lg:hidden size-9 items-center justify-center rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-800/80 transition-colors"
          aria-label="Open mobile navigation"
        >
          <MenuOutlined className="text-base" />
        </button>

        {/* Breadcrumb Indicator */}
        <div className="flex items-center gap-2 text-xs sm:text-sm font-medium">
          <span className="hidden sm:inline text-slate-400 dark:text-zinc-500">Admin</span>
          <span className="hidden sm:inline text-slate-300 dark:text-zinc-700">/</span>
          <span className="font-semibold text-slate-900 dark:text-white">
            {currentNav?.label || 'Dashboard'}
          </span>
        </div>
      </div>

      {/* Right Zone: Public Form link, Theme Switcher, Account Dropdown */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Link to Public Form */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-[#0072ce] bg-slate-100 hover:bg-sky-50 border border-slate-200/80 dark:text-slate-200 dark:hover:text-white dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/10 transition-colors shadow-2xs"
          title="Open participant feedback form in a new tab"
        >
          <span>Feedback Form</span>
          <ExportOutlined className="text-[10px]" />
        </a>

        {/* Theme Switcher */}
        <ThemeSwitcher className="hero-switch text-xs" />

        {/* User Account Menu */}
        {user && (
          <Dropdown menu={{ items: accountMenuItems }} trigger={['click']} placement="bottomRight">
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-zinc-800/70 transition-colors text-left"
              aria-label="User account menu"
            >
              <div className="size-7 sm:size-8 rounded-full bg-gradient-to-tr from-[#0072ce] to-[#00a9e8] flex items-center justify-center text-xs font-bold text-white shadow-xs">
                {initials(user.name)}
              </div>
              <span className="hidden sm:inline-block max-w-[120px] truncate text-xs font-semibold text-slate-800 dark:text-white">
                {user.name}
              </span>
              <DownOutlined className="text-[10px] text-slate-400 dark:text-slate-400 hidden sm:inline-block" />
            </button>
          </Dropdown>
        )}
      </div>
    </header>
  )
}
