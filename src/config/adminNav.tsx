import {
  DashboardOutlined,
  FileDoneOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  TableOutlined,
} from '@ant-design/icons'
import type { ReactNode } from 'react'
import { ROUTES } from './routes'

export interface AdminNavItem {
  path: string
  label: string
  icon: ReactNode
}

/** Admin navigation — drives the menu and active-item highlighting. */
export const ADMIN_NAV: AdminNavItem[] = [
  { path: ROUTES.admin.dashboard, label: 'Dashboard', icon: <DashboardOutlined /> },
  { path: ROUTES.admin.responses, label: 'Responses', icon: <TableOutlined /> },
  { path: ROUTES.admin.certificates, label: 'Certificates', icon: <FileDoneOutlined /> },
  { path: ROUTES.admin.verify, label: 'Verify', icon: <SafetyCertificateOutlined /> },
  { path: ROUTES.admin.settings, label: 'Settings', icon: <SettingOutlined /> },
]
