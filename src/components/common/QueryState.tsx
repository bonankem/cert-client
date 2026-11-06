import type { UseQueryResult } from '@tanstack/react-query'
import { Button, Result, Skeleton } from 'antd'
import type { ReactNode } from 'react'
import { errorMessage } from '@/api'

interface QueryStateProps<T> {
  query: UseQueryResult<T>
  children: (data: T) => ReactNode
  loading?: ReactNode
}

/** Loading skeleton / error with retry / content — the same for every query-backed view. */
export default function QueryState<T>({ query, children, loading }: QueryStateProps<T>) {
  if (query.isPending) return <>{loading ?? <Skeleton active paragraph={{ rows: 8 }} />}</>
  if (query.isError) {
    return (
      <Result
        status="warning"
        title="This couldn’t load"
        subTitle={errorMessage(query.error)}
        extra={<Button onClick={() => query.refetch()}>Try again</Button>}
      />
    )
  }
  return <>{children(query.data)}</>
}
