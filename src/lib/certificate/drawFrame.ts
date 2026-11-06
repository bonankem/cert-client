/*
 * Single rounded certificate card, wave texture, corner shapes and circuit
 * accents. Top-left/top-right art is drawn once and mirrored to the
 * bottom-right/bottom-left by a 180° rotation.
 */
import { polygonPath, rotated180, strokeLine, withContext } from './canvas'
import { CERT_COLORS as C } from './constants'
import type { Scene } from './types'

const linear = (ctx: CanvasRenderingContext2D, x0: number, y0: number, x1: number, y1: number, stops: readonly string[]) => {
  const g = ctx.createLinearGradient(x0, y0, x1, y1)
  stops.forEach((color, i) => g.addColorStop(i / (stops.length - 1), color))
  return g
}

/** Single white certificate canvas filling the entire area without margins or rounded corners. */
export function drawBackdrop({ ctx, W, H }: Scene): void {
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, W, H)
}

/** Sweeping hairlines in one corner region (drawn top-right; mirrored for bottom-left). */
function drawWaves(ctx: CanvasRenderingContext2D, W: number): void {
  withContext(ctx, () => {
    ctx.strokeStyle = C.waves
    ctx.lineWidth = 1.4
    ctx.globalAlpha = 0.45
    const x0 = W * 0.58
    const width = W - x0 + 40
    for (let i = 0; i < 26; i++) {
      const y = 70 + i * 15
      ctx.beginPath()
      ctx.moveTo(x0, y - 40)
      ctx.bezierCurveTo(x0 + width * 0.35, y - 160 + i * 4, x0 + width * 0.55, y + 170 - i * 3, x0 + width, y + 40 + i * 6)
      ctx.stroke()
    }
  })
}

/** Layered blue triangles with an orange stripe (drawn top-left from 0,0; mirrored for bottom-right). */
function drawCornerArt(ctx: CanvasRenderingContext2D): void {
  const o = 0
  withContext(ctx, () => {
    ctx.fillStyle = linear(ctx, o, o, o + 420, o + 420, [C.blueLight, C.blueMid])
    polygonPath(ctx, [[o + 250, o], [o + 470, o], [o, o + 470], [o, o + 250]])
    ctx.globalAlpha = 0.85
    ctx.fill()
    ctx.globalAlpha = 1

    ctx.fillStyle = linear(ctx, o, o, o + 260, o + 260, [C.blueMid, C.blueDeep])
    polygonPath(ctx, [[o, o], [o + 290, o], [o, o + 290]])
    ctx.fill()

    ctx.fillStyle = linear(ctx, o + 120, o + 160, o, o + 300, [C.blueDeep, '#08326d'])
    polygonPath(ctx, [[o, o + 160], [o + 140, o + 300], [o, o + 440]])
    ctx.fill()

    ctx.fillStyle = linear(ctx, o + 360, o, o + 560, o + 100, C.orange)
    polygonPath(ctx, [[o + 470, o], [o + 590, o], [o + 470, o + 120], [o + 350, o + 120]])
    ctx.fill()
  })
}

/** Circuit trace with an end dot and hatch marks (drawn top-right; mirrored for bottom-left). */
function drawCircuit(ctx: CanvasRenderingContext2D, W: number): void {
  const y = 178
  withContext(ctx, () => {
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.strokeStyle = C.accent
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(W - 640, y)
    ctx.lineTo(W - 400, y)
    ctx.lineTo(W - 352, y - 46)
    ctx.lineTo(W - 140, y - 46)
    ctx.stroke()
    ctx.fillStyle = C.accent
    ctx.beginPath()
    ctx.arc(W - 640, y, 8, 0, Math.PI * 2)
    ctx.fill()
    for (let i = 0; i < 4; i++) {
      const x = W - 330 + i * 24
      strokeLine(ctx, [x, y - 6], [x + 14, y - 30], { color: C.accent, width: 5 })
    }
  })
}

/** Light panel and corner art filling the entire straight canvas without border clipping. */
export function drawPanel(scene: Scene): void {
  const { ctx, W, H } = scene
  withContext(ctx, () => {
    ctx.fillStyle = linear(ctx, 0, 0, W, H, C.panel)
    ctx.fillRect(0, 0, W, H)

    drawWaves(ctx, W)
    rotated180(ctx, W, H, () => drawWaves(ctx, W))
    drawCornerArt(ctx)
    rotated180(ctx, W, H, () => drawCornerArt(ctx))
    drawCircuit(ctx, W)
    rotated180(ctx, W, H, () => drawCircuit(ctx, W))
  })
}

/** No border line or container outline; corners fill the container straight edge-to-edge. */
export function drawFrameLines(_scene: Scene): void {
  // Borderless: the artwork extends cleanly to all straight corners
}

export const FRAME_LAYERS: ReadonlyArray<(scene: Scene) => void> = [drawBackdrop, drawPanel, drawFrameLines]
