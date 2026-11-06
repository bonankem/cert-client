import { FONT_FACES } from './constants'

let fontsReady: Promise<unknown> | null = null

/** Load web fonts used on the canvas once; never wait longer than `timeout`. */
export function ensureCertificateFonts(timeout = 4000): Promise<unknown> {
  if (!fontsReady) {
    const loads = FONT_FACES.map((face) => document.fonts.load(face).catch(() => undefined))
    fontsReady = Promise.race([Promise.all(loads), new Promise((resolve) => setTimeout(resolve, timeout))])
  }
  return fontsReady
}
