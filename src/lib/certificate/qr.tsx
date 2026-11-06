import { QRCode } from 'antd'
import { createRoot } from 'react-dom/client'
import { CERT_COLORS } from './constants'

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

/** Check if the canvas has actually been painted with dark QR modules */
function hasPaintedQrModules(canvas: HTMLCanvasElement): boolean {
  if (!canvas || canvas.width === 0 || canvas.height === 0) return false
  const ctx = canvas.getContext('2d')
  if (!ctx) return false
  try {
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data
    for (let i = 0; i < data.length; i += 32) {
      // Check for dark pixel with high opacity
      if (data[i] < 120 && data[i + 3] > 180) {
        return true
      }
    }
    return false
  } catch {
    return true
  }
}

async function waitForQrCanvas(host: HTMLDivElement): Promise<HTMLCanvasElement> {
  let foundCanvas: HTMLCanvasElement | null = null
  for (let attempt = 0; attempt < 30; attempt++) {
    foundCanvas = host.querySelector('canvas')
    if (foundCanvas && hasPaintedQrModules(foundCanvas)) {
      return foundCanvas
    }
    await wait(25)
  }
  if (foundCanvas) return foundCanvas
  throw new Error('Ant Design QR code did not render in time')
}

/**
 * Render Ant Design's <QRCode> component and return a crisp copy of its canvas
 * for direct embedding into certificates.
 */
export async function renderQrCanvas(value: string, size: number): Promise<HTMLCanvasElement> {
  const host = document.createElement('div')
  host.setAttribute('aria-hidden', 'true')
  // Keep element active in DOM without visual disruption so canvas paints reliably
  host.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0.01;pointer-events:none;z-index:-1;'
  document.body.appendChild(host)
  const root = createRoot(host)

  try {
    root.render(
      <QRCode
        type="canvas"
        value={value}
        size={size}
        errorLevel="M"
        bordered={false}
        color={CERT_COLORS.ink}
        bgColor="#ffffff"
      />,
    )

    const source = await waitForQrCanvas(host)
    // Small buffer to guarantee browser paint synchronization
    await wait(40)

    const copy = document.createElement('canvas')
    copy.width = size
    copy.height = size
    const context = copy.getContext('2d')
    if (!context) throw new Error('Unable to create certificate QR canvas')

    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, size, size)
    context.drawImage(source, 0, 0, size, size)
    return copy
  } finally {
    // Unmount safely after canvas copy is extracted
    setTimeout(() => {
      try {
        root.unmount()
        host.remove()
      } catch {
        /* ignore cleanup */
      }
    }, 100)
  }
}
