/** Every API path in one place (served under /api; Vite proxies it in development). */
const enc = encodeURIComponent

export const ENDPOINTS = {
  formConfig: '/api/form-config',
  auth: {
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    me: '/api/auth/me',
    password: '/api/auth/password',
  },
  public: {
    responses: '/api/responses',
    settings: '/api/certificate-settings',
    downloads: (certId: string) => `/api/certificates/${enc(certId)}/downloads`,
    verify: (code: string) => `/api/certificates/verify/${enc(code)}`,
  },
  admin: {
    dashboard: '/api/admin/dashboard',
    responses: '/api/admin/responses',
    response: (certId: string) => `/api/admin/responses/${enc(certId)}`,
    responseDownloads: (certId: string) => `/api/admin/responses/${enc(certId)}/downloads`,
    exportCsv: '/api/admin/responses/export.csv',
    verify: '/api/admin/responses/verify',
    settings: '/api/admin/certificate-settings',
  },
} as const
