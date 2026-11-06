/** Every URL in the app is built here — never hard-code paths in components. */
export const ROUTES = {
  feedback: '/',
  verify: (code = '') => (code ? `/verify/${encodeURIComponent(code)}` : '/verify'),
  admin: {
    root: '/admin',
    login: '/admin/login',
    dashboard: '/admin/dashboard',
    responses: '/admin/responses',
    response: (certId: string) => `/admin/responses/${encodeURIComponent(certId)}`,
    certificates: '/admin/certificates',
    verify: '/admin/verify',
    settings: '/admin/settings',
    account: '/admin/account',
    help: '/admin/help',
  },
} as const

/** Relative child paths used in the route tree (see src/router). */
export const ADMIN_PATHS = {
  dashboard: 'dashboard',
  responses: 'responses',
  response: 'responses/:certId',
  certificates: 'certificates',
  verify: 'verify',
  settings: 'settings',
  account: 'account',
  help: 'help',
} as const

/** Absolute link encoded in each certificate's QR code. */
export const verificationUrl = (code: string): string => `${window.location.origin}${ROUTES.verify(code)}`
