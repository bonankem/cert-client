import { MoonOutlined, SunOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useThemeMode } from '@/hooks/useThemeMode'

export default function ThemeSwitcher({ className = '' }: { className?: string }) {
  const { isDark, setMode } = useThemeMode()
  const nextMode = isDark ? 'light' : 'dark'

  return (
    <Button
      type="text"
      size="small"
      className={className}
      aria-label={`Switch to ${nextMode} theme`}
      aria-pressed={isDark}
      title={`Switch to ${nextMode} theme`}
      icon={isDark ? <MoonOutlined /> : <SunOutlined />}
      onClick={() => setMode(nextMode)}
    >
      {isDark ? 'Dark' : 'Light'}
    </Button>
  )
}
