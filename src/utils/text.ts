/** Collapse repeated whitespace and trim. */
export const cleanName = (value: string | null | undefined = ''): string =>
  String(value ?? '').replace(/\s+/g, ' ').trim()

/** At least a first name and a surname. */
export const isFullName = (value?: string | null): boolean => {
  const name = cleanName(value)
  return name.length >= 4 && name.split(' ').length >= 2
}

export const firstName = (value?: string | null): string => cleanName(value).split(' ')[0]

export const toSafeFilename = (value: string, fallback = 'Participant'): string =>
  value
    .replace(/[^A-Za-z0-9À-ÿ -]/g, '')
    .trim()
    .replace(/\s+/g, '-') || fallback

export const pluralize = (count: number, word: string): string => `${count} ${word}${count === 1 ? '' : 's'}`

export const includesIgnoreCase = (haystack: string, needle: string): boolean =>
  haystack.toLowerCase().includes(needle.trim().toLowerCase())
