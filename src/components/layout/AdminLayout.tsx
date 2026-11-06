import { Suspense, useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import PageSpinner from '@/components/common/PageSpinner'
import SiteFooter from './SiteFooter'
import AdminHeader from './admin/AdminHeader'
import AdminMobileDrawer from './admin/AdminMobileDrawer'
import AdminSidebar from './admin/AdminSidebar'

/**
 * Shell for every /admin/* page:
 * Uses our private AdminSidebar and AdminHeader components for flexible layout control.
 */
export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const { pathname } = useLocation()
  const scrollRef = useRef<HTMLDivElement>(null)

  // The content pane is the scroll container, so reset it on navigation.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 })
  }, [pathname])

  return (
    // App shell: the viewport never scrolls. The sidebar stays fixed and only the
    // right-hand pane (header + page + footer) scrolls.
    <div className="flex h-dvh w-full overflow-hidden bg-[var(--color-page)] dark:bg-zinc-950 text-slate-900 dark:text-zinc-100">
      {/* 1. Desktop sidebar (fixed, full height) */}
      <div className="hidden lg:flex h-full shrink-0 z-40">
        <AdminSidebar
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((c) => !c)}
        />
      </div>

      {/* 2. Scrollable content pane */}
      <div ref={scrollRef} className="flex flex-1 flex-col min-w-0 h-full overflow-y-auto overflow-x-hidden">
        <AdminHeader onOpenMobileNav={() => setMobileNavOpen(true)} />

        <main className="flex-1 w-full max-w-7xl mx-auto px-2.5 py-3 sm:px-6 sm:py-6 min-w-0">
          <Suspense fallback={<PageSpinner />}>
            <Outlet />
          </Suspense>
        </main>

        <SiteFooter />
      </div>

      {/* 3. Mobile Navigation Drawer */}
      <AdminMobileDrawer
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />
    </div>
  )
}
