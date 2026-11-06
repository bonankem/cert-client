import { useSyncExternalStore } from 'react'

const QUERY = '(prefers-color-scheme: dark)'

const subscribe = (onChange: () => void) => {
  const media = window.matchMedia(QUERY)
  media.addEventListener('change', onChange)
  return () => media.removeEventListener('change', onChange)
}

const getSnapshot = () => window.matchMedia(QUERY).matches

/** True when the OS prefers a dark colour scheme. */
export const useIsDarkMode = (): boolean => useSyncExternalStore(subscribe, getSnapshot, () => false)
