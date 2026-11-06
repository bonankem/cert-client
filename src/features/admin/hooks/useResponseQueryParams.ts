import type { TableProps } from 'antd'
import type { SorterResult } from 'antd/es/table/interface'
import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  PAGE_SIZES,
  type ApprovalStatus,
  type ConsentValue,
  type DownloadStatus,
  type ListResponsesQuery,
  type PageSize,
  type ResponseSummary,
  type SortField,
  type SortOrder,
} from '@/types'

const SORT_FIELDS: readonly SortField[] = ['submittedAt', 'name', 'participantDownloads', 'lastDownloadedAt']
const SORT_ORDERS: readonly SortOrder[] = ['ascend', 'descend']
const CONSENTS: readonly ConsentValue[] = ['Yes', 'No']
const STATUSES: readonly DownloadStatus[] = ['downloaded', 'pending']
const APPROVALS: readonly ApprovalStatus[] = ['pending', 'approved', 'rejected']

const DEFAULTS = { page: 1, pageSize: 20 as PageSize, sortField: 'submittedAt' as SortField, sortOrder: 'descend' as SortOrder }

const oneOf = <T extends string>(value: string | null, allowed: readonly T[]): T | undefined =>
  allowed.includes(value as T) ? (value as T) : undefined

function parse(params: URLSearchParams): ListResponsesQuery {
  const page = Number(params.get('page'))
  const pageSize = Number(params.get('pageSize')) as PageSize
  const opco = params.getAll('opco')
  return {
    page: Number.isInteger(page) && page > 0 ? page : DEFAULTS.page,
    pageSize: PAGE_SIZES.includes(pageSize) ? pageSize : DEFAULTS.pageSize,
    sortField: oneOf(params.get('sort'), SORT_FIELDS) ?? DEFAULTS.sortField,
    sortOrder: oneOf(params.get('order'), SORT_ORDERS) ?? DEFAULTS.sortOrder,
    search: params.get('q') || undefined,
    opco: opco.length ? opco : undefined,
    consent: oneOf(params.get('consent'), CONSENTS),
    status: oneOf(params.get('status'), STATUSES),
    approval: oneOf(params.get('approval'), APPROVALS),
    updates: params.get('updates') === 'pending' ? 'pending' : undefined,
  }
}

/** Only non-default values go in the URL, so links stay short and shareable. */
function serialize(query: ListResponsesQuery): URLSearchParams {
  const params = new URLSearchParams()
  if (query.page !== DEFAULTS.page) params.set('page', String(query.page))
  if (query.pageSize !== DEFAULTS.pageSize) params.set('pageSize', String(query.pageSize))
  if (query.sortField !== DEFAULTS.sortField || query.sortOrder !== DEFAULTS.sortOrder) {
    params.set('sort', query.sortField)
    params.set('order', query.sortOrder)
  }
  if (query.search) params.set('q', query.search)
  query.opco?.forEach((o) => params.append('opco', o))
  if (query.consent) params.set('consent', query.consent)
  if (query.status) params.set('status', query.status)
  if (query.approval) params.set('approval', query.approval)
  if (query.updates) params.set('updates', query.updates)
  return params
}

/**
 * Table state (page, sort, filters, search) lives in the URL, so a filtered
 * view can be bookmarked, shared, and survives reloads and back/forward.
 */
export function useResponseQueryParams() {
  const [params, setParams] = useSearchParams()
  const query = useMemo(() => parse(params), [params])

  /** Apply changes; filter/search changes jump back to page 1. */
  const update = useCallback(
    (patch: Partial<ListResponsesQuery>) => {
      const resetsPage = Object.keys(patch).some((k) => k !== 'page' && k !== 'pageSize')
      setParams(serialize({ ...query, ...(resetsPage && { page: 1 }), ...patch }), { replace: true })
    },
    [query, setParams],
  )

  const onTableChange = useCallback<NonNullable<TableProps<ResponseSummary>['onChange']>>(
    (pagination, filters, sorter) => {
      const sort = (Array.isArray(sorter) ? sorter[0] : sorter) as SorterResult<ResponseSummary> | undefined
      const sortField = sort?.order ? (sort.columnKey as SortField) : DEFAULTS.sortField
      const opco = (filters.opco as string[] | null) ?? undefined
      const consent = (filters.consent?.[0] as ConsentValue | undefined) ?? undefined
      const filtersChanged = String(opco) !== String(query.opco) || consent !== query.consent
      setParams(
        serialize({
          ...query,
          page: filtersChanged ? 1 : (pagination.current ?? 1),
          pageSize: (pagination.pageSize as PageSize) ?? query.pageSize,
          sortField,
          sortOrder: sort?.order ?? DEFAULTS.sortOrder,
          opco,
          consent,
        }),
        { replace: true },
      )
    },
    [query, setParams],
  )

  return { query, update, onTableChange }
}
