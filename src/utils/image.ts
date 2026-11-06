/** Resolves to an image, or null if the source is empty or fails to load. */
export function loadImage(src?: string | null): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    if (!src) return resolve(null)
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => resolve(null)
    img.src = src
  })
}

export function readFileAsDataUrl(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

interface SignatureOptions {
  maxWidth?: number
  whiteThreshold?: number
}

/**
 * Downscale a signature photo/scan and make its near-white background
 * transparent so it sits cleanly on the certificate.
 */
export async function prepareSignatureImage(
  file: Blob,
  { maxWidth = 700, whiteThreshold = 225 }: SignatureOptions = {},
): Promise<string> {
  const img = await loadImage(await readFileAsDataUrl(file))
  if (!img) throw new Error('Unreadable image')

  const ratio = Math.min(1, maxWidth / img.width)
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(img.width * ratio)
  canvas.height = Math.round(img.height * ratio)

  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas unavailable')
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

  try {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const px = imageData.data
    for (let i = 0; i < px.length; i += 4) {
      if ((px[i] + px[i + 1] + px[i + 2]) / 3 > whiteThreshold) px[i + 3] = 0
    }
    ctx.putImageData(imageData, 0, 0)
  } catch {
    /* tainted canvas — keep the opaque version */
  }

  return canvas.toDataURL('image/png')
}
