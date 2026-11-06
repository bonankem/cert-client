import { CloseOutlined } from '@ant-design/icons'
import { Link, useLocation } from 'react-router-dom'
import BrandLogo from '@/components/common/BrandLogo'
import { ROUTES } from '@/config/routes'
import { ADMIN_SIDEBAR_NAV, PendingBadge } from './AdminSidebar'

interface AdminMobileDrawerProps {
  open: boolean
  onClose: () => void
}

/**
 * Standard, editable Mobile Navigation Drawer for Admin layout.
 * Light and airy in light mode with primary blue accents.
 */
export default function AdminMobileDrawer({ open, onClose }: AdminMobileDrawerProps) {
  const { pathname } = useLocation()

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-slate-900/60 dark:bg-black/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over panel */}
      <div className="relative flex w-72 max-w-[85vw] flex-col h-full bg-gradient-to-b from-white via-[#f0f7ff] to-[#e6f2fc] border-r border-slate-200/90 text-slate-800 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-900 dark:border-zinc-800/80 dark:text-white shadow-2xl">
        {/* Drawer Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-200/80 dark:border-zinc-800/80 px-4">
          <Link
            to={ROUTES.admin.dashboard}
            onClick={onClose}
            className="flex items-center gap-2.5"
          >
            <BrandLogo name="zoracom" className="h-5" />
            <span className="text-xs font-bold text-[#0072ce] dark:text-sky-400">Admin</span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-800 hover:bg-slate-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800/80 transition-colors"
            aria-label="Close navigation"
          >
            <CloseOutlined className="text-sm" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-2 pb-2 text-[10px] font-bold tracking-wider text-slate-400 dark:text-zinc-500 uppercase">
            Navigation
          </div>
          {ADMIN_SIDEBAR_NAV.map((item) => {
            const Icon = item.icon
            const isActive =
              pathname === item.path ||
              (item.path !== ROUTES.admin.dashboard && pathname.startsWith(item.path))

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs sm:text-[13px] font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600/12 via-blue-500/8 to-sky-400/5 text-[#0072ce] font-semibold border-l-[3px] border-[#0072ce] shadow-2xs dark:from-sky-500/20 dark:to-sky-500/5 dark:text-sky-400 dark:border-sky-400'
                    : 'text-slate-600 hover:bg-white/80 hover:text-slate-900 border-l-[3px] border-transparent dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white'
                }`}
              >
                <Icon
                  className={`text-base shrink-0 ${
                    isActive ? 'text-[#0072ce] dark:text-sky-400' : 'text-slate-400 dark:text-zinc-400'
                  }`}
                />
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
                {item.pendingBadge && <PendingBadge />}
              </Link>
            )
          })}
        </nav>

        {/* Drawer Footer */}
        <div className="border-t border-slate-200/80 dark:border-zinc-800/80 p-4 text-xs text-slate-500 dark:text-zinc-400">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-full py-2 px-3 rounded-lg bg-[#0072ce]/10 hover:bg-[#0072ce]/15 text-[#0072ce] font-semibold transition-colors mb-2 dark:bg-white/5 dark:hover:bg-white/10 dark:text-slate-200"
          >
            Open Participant Form ↗
          </a>
          <div className="text-center text-[11px] text-slate-400 dark:text-zinc-500">
            StableNet Training · MTN Cameroon
          </div>
        </div>
      </div>
    </div>
  )
}
