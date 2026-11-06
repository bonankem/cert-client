import type { ComponentType } from 'react'
import { createBrowserRouter, Navigate, type RouteObject } from 'react-router-dom'
import PageSpinner from '@/components/common/PageSpinner'
import AdminLayout from '@/components/layout/AdminLayout'
import { ADMIN_PATHS, ROUTES } from '@/config/routes'
import RouteErrorPage from '@/pages/RouteErrorPage'
import RequireAdmin from './RequireAdmin'

/** Code-split a page: the route loads its own chunk on first visit. */
const page = (load: () => Promise<{ default: ComponentType }>): RouteObject['lazy'] => async () => ({
  Component: (await load()).default,
})

const adminRoutes: RouteObject[] = [
  { index: true, element: <Navigate to={ADMIN_PATHS.dashboard} replace /> },
  { path: ADMIN_PATHS.dashboard, lazy: page(() => import('@/pages/admin/DashboardPage')) },
  { path: ADMIN_PATHS.responses, lazy: page(() => import('@/pages/admin/ResponsesPage')) },
  { path: ADMIN_PATHS.response, lazy: page(() => import('@/pages/admin/ResponseDetailPage')) },
  { path: ADMIN_PATHS.certificates, lazy: page(() => import('@/pages/admin/CertificatesPage')) },
  { path: ADMIN_PATHS.verify, lazy: page(() => import('@/pages/admin/VerifyPage')) },
  { path: ADMIN_PATHS.settings, lazy: page(() => import('@/pages/admin/SettingsPage')) },
  { path: ADMIN_PATHS.account, lazy: page(() => import('@/pages/admin/AccountPage')) },
  { path: '*', lazy: page(() => import('@/pages/admin/AdminNotFoundPage')) },
]

export const router = createBrowserRouter([
  {
    errorElement: <RouteErrorPage />,
    hydrateFallbackElement: <PageSpinner />,
    children: [
      // Public
      { path: ROUTES.feedback, lazy: page(() => import('@/pages/FeedbackPage')) },
      { path: ROUTES.admin.login, lazy: page(() => import('@/pages/admin/LoginPage')) },
      { path: `${ROUTES.verify()}/:code?`, lazy: page(() => import('@/pages/VerifyPage')) },

      // Admin (session checked with the server)
      {
        element: <RequireAdmin />,
        children: [{ path: ROUTES.admin.root, element: <AdminLayout />, children: adminRoutes }],
      },

      // Legacy + fallbacks
      { path: '/trainer', element: <Navigate to={ROUTES.admin.root} replace /> },
      { path: '*', lazy: page(() => import('@/pages/NotFoundPage')) },
    ],
  },
])
