import { useCallback } from 'react'
import { STORAGE_KEYS } from '@/config/constants'
import { createWebStore } from '@/services/webStore'
import { useIsDarkMode } from './useColorScheme'
import { useWebStore } from './useWebStore'

export type ThemeMode = 'system' | 'light' | 'dark'

const themeStore = createWebStore<ThemeMode>(STORAGE_KEYS.theme, 'system')

/** The viewer's chosen theme (remembered per browser) and what it resolves to. */
export function useThemeMode() {
  const mode = useWebStore(themeStore)
  const systemDark = useIsDarkMode()
  const isDark = mode === 'dark' || (mode === 'system' && systemDark)

  const setMode = useCallback((next: ThemeMode) => {
    try {
      themeStore.set(next)
    } catch {
      /* storage unavailable — the choice just won't persist */
    }
  }, [])

  return { mode, isDark, setMode }
}
