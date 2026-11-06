/** Thin fetch wrapper: JSON in/out, session cookie, CSRF header, typed errors. */

export class ApiError extends Error {
  readonly status: number
  /** Field-level messages from validation errors. */
  readonly messages: string[]

  constructor(status: number, messages: string[]) {
    super(messages[0] ?? `Request failed (${status})`)
    this.name = 'ApiError'
    this.status = status
    this.messages = messages
  }
}

type QueryValue = string | number | boolean | null | undefined | readonly (string | number)[]

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  query?: Record<string, QueryValue>
  signal?: AbortSignal
}

/** Build "path?a=1&b=x&b=y", skipping empty values. Arrays repeat the key. */
export function withQuery(path: string, query?: Record<string, QueryValue>): string {
  if (!query) return path
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === '') continue
    for (const item of Array.isArray(value) ? value : [value]) params.append(key, String(item))
  }
  const qs = params.toString()
  return qs ? `${path}?${qs}` : path
}

async function readError(response: Response): Promise<ApiError> {
  try {
    const body = (await response.json()) as { message?: string | string[] }
    const messages = Array.isArray(body.message) ? body.message : body.message ? [body.message] : []
    return new ApiError(response.status, messages)
  } catch {
    return new ApiError(response.status, [])
  }
}

export async function request<T>(path: string, { method = 'GET', body, query, signal }: RequestOptions = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('stablenet_sid') : null
  const response = await fetch(withQuery(path, query), {
    method,
    signal,
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      // Required by the server's CSRF guard on state-changing requests.
      'X-Requested-With': 'XMLHttpRequest',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(body !== undefined && { 'Content-Type': 'application/json' }),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) throw await readError(response)
  if (response.status === 204) return undefined as T
  return (await response.json()) as T
}

/** A user-facing message for any thrown error. */
export function errorMessage(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (error instanceof ApiError) {
    if (error.status === 429) return 'Too many attempts. Please wait a few minutes and try again.'
    if (error.status >= 500 || !error.messages.length) return fallback
    return error.messages.join(' ')
  }
  if (error instanceof TypeError) return 'Can’t reach the server. Check your connection and try again.'
  return fallback
}

export const isUnauthorized = (error: unknown): boolean => error instanceof ApiError && error.status === 401
