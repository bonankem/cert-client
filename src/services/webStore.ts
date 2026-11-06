export interface Store<T> {
  /** Cached, referentially stable snapshot (safe for useSyncExternalStore). */
  get: () => T
  /** Throws if storage is full or unavailable. */
  set: (value: T) => void
  subscribe: (listener: () => void) => () => void
}

type StorageKind = 'local' | 'session'

const resolveStorage = (kind: StorageKind): Storage => (kind === 'local' ? window.localStorage : window.sessionStorage)

/** A tiny observable wrapper around one Web Storage key holding JSON. */
export function createWebStore<T>(key: string, fallback: T, kind: StorageKind = 'local'): Store<T> {
  const listeners = new Set<() => void>()
  let cachedRaw: string | null | undefined
  let cachedValue: T = fallback

  const get = (): T => {
    let raw: string | null = null
    try {
      raw = resolveStorage(kind).getItem(key)
    } catch {
      /* storage unavailable (private mode, blocked) */
    }
    if (raw !== cachedRaw) {
      cachedRaw = raw
      try {
        cachedValue = raw ? (JSON.parse(raw) as T) : fallback
      } catch {
        cachedValue = fallback
      }
    }
    return cachedValue
  }

  const notify = () => listeners.forEach((listener) => listener())

  const set = (value: T): void => {
    if (value === null || value === undefined) resolveStorage(kind).removeItem(key)
    else resolveStorage(kind).setItem(key, JSON.stringify(value))
    notify()
  }

  const subscribe = (listener: () => void) => {
    listeners.add(listener)
    const onStorage = (event: StorageEvent) => {
      if (event.key === key) listener()
    }
    window.addEventListener('storage', onStorage)
    return () => {
      listeners.delete(listener)
      window.removeEventListener('storage', onStorage)
    }
  }

  return { get, set, subscribe }
}

export const isQuotaError = (error: unknown): boolean =>
  error instanceof DOMException && (error.name === 'QuotaExceededError' || error.code === 22 || error.code === 1014)
