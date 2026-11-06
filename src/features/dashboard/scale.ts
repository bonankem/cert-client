/**
 * Map an answer's position (best → worst) onto the diverging palette.
 * 5-point scales use the neutral grey midpoint; 4-point scales have no
 * midpoint, so they skip it.
 */
const STEPS_BY_LENGTH: Record<number, number[]> = {
  2: [1, 5],
  3: [1, 3, 5],
  4: [1, 2, 4, 5],
  5: [1, 2, 3, 4, 5],
}

export function scaleStep(index: number, optionCount: number): number {
  return STEPS_BY_LENGTH[optionCount]?.[index] ?? 3
}

export const fillVar = (step: number) => `var(--viz-div-${step})`
export const inkVar = (step: number) => `var(--viz-ink-${step})`

export const percent = (part: number, whole: number): number => (whole > 0 ? Math.round((part / whole) * 100) : 0)
