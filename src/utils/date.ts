/** e.g. "5 November 2026" */
export function formatLongDate(iso?: string | null): string {
  if (!iso) return ''
  const date = new Date(iso)
  return Number.isNaN(date.getTime())
    ? iso
    : date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

/** e.g. "5 Nov 2026, 14:32" */
export function formatDateTime(iso?: string | null): string {
  if (!iso) return ''
  const date = new Date(iso)
  return Number.isNaN(date.getTime())
    ? iso
    : date.toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

/** e.g. "261105" (YYMMDD) */
export function compactDateStamp(date: Date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return String(date.getFullYear()).slice(2) + pad(date.getMonth() + 1) + pad(date.getDate())
}

export const byNewest =
  <T,>(pick: (item: T) => string | null | undefined) =>
  (a: T, b: T): number =>
    (pick(b) ?? '').localeCompare(pick(a) ?? '')
