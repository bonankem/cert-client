import { theme as antdTheme, type ThemeConfig } from 'antd'

/** Brand palette — single source of truth for antd tokens and the certificate canvas. */
export const BRAND = {
  navy: '#0B2A5B',
  blue: '#0072CE',
  sky: '#00A9E8',
  green: '#3AAA35',
  orange: '#F26A21',
  text: '#13233F',
  muted: '#56677F',
  line: '#D3DDEA',
  white: '#FFFFFF',
} as const

export const FONT_STACK = 'Raleway, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'

interface Palette {
  primary: string
  bgLayout: string
  bgContainer: string
  bgSubtle: string
  border: string
  text: string
  textSecondary: string
  error: string
}

const PALETTE: Record<'light' | 'dark', Palette> = {
  light: {
    primary: BRAND.blue,
    bgLayout: '#EDF2F8',
    bgContainer: '#FFFFFF',
    bgSubtle: '#F3F7FC',
    border: BRAND.line,
    text: BRAND.text,
    textSecondary: BRAND.muted,
    error: '#C62828',
  },
  dark: {
    primary: '#38bdf8',
    bgLayout: '#09090b',
    bgContainer: '#18181b',
    bgSubtle: '#27272a',
    border: '#27272a',
    text: '#f4f4f5',
    textSecondary: '#a1a1aa',
    error: '#f87171',
  },
}

export function getAntdTheme(isDark: boolean): ThemeConfig {
  const p = isDark ? PALETTE.dark : PALETTE.light

  return {
    algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
    token: {
      colorPrimary: p.primary,
      colorInfo: p.primary,
      colorSuccess: BRAND.green,
      colorWarning: BRAND.orange,
      colorError: p.error,
      colorBgLayout: p.bgLayout,
      colorBgContainer: p.bgContainer,
      colorBgElevated: p.bgContainer,
      colorBorder: p.border,
      colorBorderSecondary: p.border,
      colorText: p.text,
      colorTextSecondary: p.textSecondary,
      colorTextDescription: p.textSecondary,
      fontFamily: FONT_STACK,
      fontSize: 13.5,
      fontSizeSM: 12.5,
      borderRadius: 7,
      borderRadiusSM: 5,
      borderRadiusLG: 14,
      controlHeight: 32,
      controlHeightSM: 28,
    },
    components: {
      Button: { fontWeight: 600, fontSize: 13.5, controlHeightSM: 28 },
      Card: { headerFontSize: 16 },
      // Compact form rhythm: tighter label gap and field spacing.
      Form: { verticalLabelPadding: 0, itemMarginBottom: 10 },
      Input: { fontSize: 13.5, controlHeightSM: 28 },
      Select: {
        fontSize: 13.5,
        controlHeightSM: 28,
        optionFontSize: 13.5,
      },
      DatePicker: { fontSize: 13.5, controlHeightSM: 28 },
      Dropdown: { fontSize: 13.5 },
      Layout: { headerBg: BRAND.navy, headerPadding: '0 20px', bodyBg: p.bgLayout },
      Menu: { fontSize: 13.5, darkItemBg: 'transparent', darkItemSelectedBg: 'rgba(255,255,255,0.14)' },
      Radio: { buttonBg: p.bgSubtle, fontSize: 13.5 },
      Table: { headerBg: p.bgSubtle, fontSize: 13.5 },
      Segmented: { fontSize: 13 },
    },
  }
}
