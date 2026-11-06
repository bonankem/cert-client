import { Button, Result } from 'antd'
import { isRouteErrorResponse, useRouteError } from 'react-router-dom'
import NotFoundPage from './NotFoundPage'

/** Catches errors thrown while loading or rendering any route. */
export default function RouteErrorPage() {
  const error = useRouteError()

  if (isRouteErrorResponse(error) && error.status === 404) return <NotFoundPage />

  return (
    <Result
      status="error"
      title="Something went wrong"
      subTitle="Reload the page to try again."
      extra={
        <Button type="primary" onClick={() => window.location.reload()}>
          Reload
        </Button>
      }
    />
  )
}
