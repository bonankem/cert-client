import { StyleProvider } from '@ant-design/cssinjs'
import { QueryClientProvider } from '@tanstack/react-query'
import { App as AntApp, ConfigProvider } from 'antd'
import { useEffect, useMemo, type ReactNode } from 'react'
import { getAntdTheme } from '@/config/theme'
import { useThemeMode } from '@/hooks/useThemeMode'
import { queryClient } from './queryClient'

export default function AppProviders({ children }: { children: ReactNode }) {
  const { isDark } = useThemeMode()

  // Drives Tailwind dark: utilities, chart tokens and native controls.
  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = isDark ? 'dark' : 'light'
    root.style.colorScheme = isDark ? 'dark' : 'light'
  }, [isDark])
  const theme = useMemo(() => getAntdTheme(isDark), [isDark])

  return (
    <QueryClientProvider client={queryClient}>
      <StyleProvider layer>
        <ConfigProvider componentSize="small" theme={theme}>
          <AntApp>{children}</AntApp>
        </ConfigProvider>
      </StyleProvider>
    </QueryClientProvider>
  )
}
