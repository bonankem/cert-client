import { CERT_COLORS, CERT_FONTS } from './constants'
import type { Point, TextStyle } from './types'

export const font = (weight: number, size: number, family: string = CERT_FONTS.sans, italic = false) =>
  `${italic ? 'italic ' : ''}${weight} ${size}px ${family}`

/** Run drawing code inside save()/restore(). */
export function withContext(ctx: CanvasRenderingContext2D, draw: () => void): void {
  ctx.save()
  try {
    draw()
  } finally {
    ctx.restore()
  }
}

type SpacedContext = CanvasRenderingContext2D & { letterSpacing?: string }

export function drawText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  { weight = 500, size, family, color = CERT_COLORS.ink, align = 'center', italic = false, letterSpacing }: TextStyle,
): void {
  withContext(ctx, () => {
    ctx.font = font(weight, size, family, italic)
    ctx.fillStyle = color
    ctx.textAlign = align
    ctx.textBaseline = 'alphabetic'
    if (letterSpacing && 'letterSpacing' in ctx) (ctx as SpacedContext).letterSpacing = letterSpacing
    ctx.fillText(text, x, y)
  })
}

interface FitOptions {
  weight: number
  size: number
  family?: string
  italic?: boolean
  maxWidth: number
  min?: number
  step?: number
}

/** Largest size (stepping down from `size`) at which `text` fits `maxWidth`. */
export function fitFontSize(
  ctx: CanvasRenderingContext2D,
  text: string,
  { weight, size, family, italic, maxWidth, min = 24, step = 4 }: FitOptions,
): number {
  let current = size
  while (current > min) {
    ctx.font = font(weight, current, family, italic)
    if (ctx.measureText(text).width <= maxWidth) break
    current -= step
  }
  return current
}

export function strokeLine(
  ctx: CanvasRenderingContext2D,
  [x1, y1]: Point,
  [x2, y2]: Point,
  { color, width }: { color: string; width: number },
): void {
  ctx.strokeStyle = color
  ctx.lineWidth = width
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.stroke()
}

/** Closed path through the given points. */
export function polygonPath(ctx: CanvasRenderingContext2D, points: readonly Point[]): void {
  ctx.beginPath()
  points.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)))
  ctx.closePath()
}

/** Rectangle whose corners are cut by concave quarter-circles (the certificate frame). */
export function notchedRectPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.arc(x + w, y, r, Math.PI, Math.PI / 2, true)
  ctx.lineTo(x + w, y + h - r)
  ctx.arc(x + w, y + h, r, (3 * Math.PI) / 2, Math.PI, true)
  ctx.lineTo(x + r, y + h)
  ctx.arc(x, y + h, r, 0, -Math.PI / 2, true)
  ctx.lineTo(x, y + r)
  ctx.arc(x, y, r, Math.PI / 2, 0, true)
  ctx.closePath()
}

/** Horizontal hexagon (pointed left and right ends), centred on (cx, cy). */
export function hexagonPoints(cx: number, cy: number, w: number, h: number, tip: number): Point[] {
  const left = cx - w / 2
  const right = cx + w / 2
  return [
    [left, cy],
    [left + tip, cy - h / 2],
    [right - tip, cy - h / 2],
    [right, cy],
    [right - tip, cy + h / 2],
    [left + tip, cy + h / 2],
  ]
}

/** Point a fraction `t` of the way from a to b, nudged by (dx, dy). */
export const along = ([ax, ay]: Point, [bx, by]: Point, t: number, dx = 0, dy = 0): Point => [
  ax + (bx - ax) * t + dx,
  ay + (by - ay) * t + dy,
]

interface Size {
  width: number
  height: number
}

/** Scale an image to a target height, preserving aspect ratio. */
export const scaleToHeight = (img: CanvasImageSource & { width: number; height: number }, height: number): Size => ({
  width: (img.width * height) / img.height,
  height,
})

/** Scale an image to fit inside a box, preserving aspect ratio. */
export function scaleToFit(img: { width: number; height: number }, maxWidth: number, maxHeight: number): Size {
  const ratio = Math.min(maxWidth / img.width, maxHeight / img.height)
  return { width: img.width * ratio, height: img.height * ratio }
}

/** Mirror a drawing by rotating 180° around the canvas centre (top-left ↔ bottom-right). */
export function rotated180(ctx: CanvasRenderingContext2D, W: number, H: number, draw: () => void): void {
  withContext(ctx, () => {
    ctx.translate(W, H)
    ctx.rotate(Math.PI)
    draw()
  })
}
