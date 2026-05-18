import { DashboardPage } from './pages/dashboard.js'

import { AssetsPage } from './pages/assets.js'
import { SupportPage } from './pages/support.js'
import { RepairHistoryPage } from './pages/repairhistory.js'
import { MonitoringPage } from './pages/monitoring.js'
import { ActivityLogsPage } from './pages/activitylog.js'
import { NewAssetsForm } from './pages/form/newAssetsForm.js'
import { UserFormPage } from './pages/form/userForm.js'
import { AdminUsersPage } from './pages/adminUsers.js'
import { CasesPage } from './pages/cases.js'
import { UserProfilePage } from './pages/userProfile.js'
import { AccessControlPage } from './pages/accessControl.js'
import { MaintenanceFormPage } from './pages/form/MaintenanceForm.js'

export const MENU_CONFIG = {
  header: {
    title: 'BuilderUI',
    subtitle: 'Management System',
    icon: 'dashboard',
  },
  user: {
    id: 1,
    name: 'Ruki Nasa',
    role: 'Administrator',
    department: 'IT',
  },
  items: [
    {
      label: 'Dashboard',
      icon: 'dashboard',
      path: '/dashboard',
      isDefault: true,
      line: false,
      content: (user) => DashboardPage(user),
    },
    {
      label: 'Assets',
      icon: 'assets',
      path: '/assets',
      isDefault: true,
      line: false,
      content: (user) => AssetsPage(user),
    },
    {
      label: 'Assets',
      icon: 'assets',
      path: '/newassetsform',
      isDefault: true,
      line: false,
      hidden: true,
      content: (user) => NewAssetsForm(user),
    },
    {
      label: 'Support',
      icon: 'support',
      path: '/support',
      isDefault: true,
      line: false,
      content: (user) => SupportPage(user),
    },
    {
      label: 'Repair History',
      icon: 'repair-history',
      path: '/repair-history',
      isDefault: true,
      line: false,
      content: (user) => RepairHistoryPage(user),
    },
    {
      label: 'Monitoring',
      icon: 'monitoring',
      path: '/monitoring',
      isDefault: true,
      line: false,
      content: (user) => MonitoringPage(user),
    },
    {
      label: 'Add Maintenance',
      icon: 'monitoring',
      path: '/critical_maintenance',
      isDefault: false,
      line: false,
      hidden: true,
      content: (user) => MaintenanceFormPage(user),
    },
    {
      label: 'Activity Logs',
      icon: 'activity-logs',
      path: '/activity-logs',
      isDefault: true,
      line: false,
      content: (user) => ActivityLogsPage(user),
    },
    {
      label: 'Users',
      icon: 'user',
      path: '/users',
      isDefault: true,
      line: false,
      content: () => AdminUsersPage(),
    },
    {
      label: 'User Form',
      icon: 'user',
      path: '/userform',
      isDefault: false,
      line: false,
      hidden: true,
      content: (user) => UserFormPage(user),
    },
    {
      label: 'Cases',
      icon: 'clipboard',
      path: '/cases',
      isDefault: true,
      line: false,
      content: (user) => CasesPage(user),
    },
    {
      label: 'Access Control',
      icon: 'shield',
      path: '/access-control',
      isDefault: false,
      line: false,
      content: () => AccessControlPage(),
    },
    {
      label: 'User Profile',
      icon: 'user',
      path: '/user-profile',
      isDefault: false,
      line: false,
      hidden: true,
      content: (user) => UserProfilePage(user),
    },
  ],
}
