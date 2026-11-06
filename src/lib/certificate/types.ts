/** Everything a draw step needs to know about the canvas. */
export interface Scene {
  ctx: CanvasRenderingContext2D
  W: number
  H: number
  cx: number
}

export type Point = readonly [number, number]

export interface TextStyle {
  weight?: number
  size: number
  family?: string
  color?: string | CanvasGradient
  align?: CanvasTextAlign
  italic?: boolean
  /** CSS length, e.g. "12px" (ignored where canvas letterSpacing is unsupported). */
  letterSpacing?: string
}
