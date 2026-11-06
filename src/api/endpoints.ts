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
    status: (token: string) => `/api/certificates/status/${enc(token)}`,
  },
  admin: {
    dashboard: '/api/admin/dashboard',
    responses: '/api/admin/responses',
    response: (certId: string) => `/api/admin/responses/${enc(certId)}`,
    responseDownloads: (certId: string) => `/api/admin/responses/${enc(certId)}/downloads`,
    exportCsv: '/api/admin/responses/export.csv',
    verify: '/api/admin/responses/verify',
    pendingCount: '/api/admin/responses/pending-count',
    approve: '/api/admin/responses/approve',
    reject: (certId: string) => `/api/admin/responses/${enc(certId)}/reject`,
    approveUpdate: (certId: string) => `/api/admin/responses/${enc(certId)}/update/approve`,
    rejectUpdate: (certId: string) => `/api/admin/responses/${enc(certId)}/update/reject`,
    notificationEmails: '/api/admin/notification-emails',
    notificationTest: '/api/admin/notification-emails/test',
    roster: '/api/admin/roster',
    rosterEntry: (id: string) => `/api/admin/roster/${enc(id)}`,
    settings: '/api/admin/certificate-settings',
  },
} as const
