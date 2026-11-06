import { Navigate, Outlet, useLocation } from 'react-router-dom'
import PageSpinner from '@/components/common/PageSpinner'
import { ROUTES } from '@/config/routes'
import { useMe } from '@/hooks/queries/auth'
import QueryState from '@/components/common/QueryState'

export interface LoginRedirectState {
  from?: string
}

/** Layout route: renders child routes only for a signed-in admin (checked with the server). */
export default function RequireAdmin() {
  const me = useMe()
  const location = useLocation()

  return (
    <QueryState query={me} loading={<PageSpinner />}>
      {(user) => {
        if (user) return <Outlet />
        const state: LoginRedirectState = { from: location.pathname + location.search }
        return <Navigate to={ROUTES.admin.login} replace state={state} />
      }}
    </QueryState>
  )
}
