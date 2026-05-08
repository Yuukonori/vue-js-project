import { DashboardPage } from './pages/dashboard.js'
import { DashboardFuturistic } from './pages/dashboardFuturistic.js'
import { AssetsPage } from './pages/assets.js'
import { SupportPage } from './pages/support.js'
import { RepairHistoryPage } from './pages/repairhistory.js'
import { MonitoringPage } from './pages/monitoring.js'
import { ActivityLogsPage } from './pages/activitylog.js'
import { NewAssetsForm } from './pages/form/newAssetsForm.js'
import { AdminUsersPage } from './pages/adminUsers.js'
import { CasesPage } from './pages/cases.js'
import { UserProfilePage } from './pages/userProfile.js'

export const MENU_CONFIG = {
  header: {
    title:    'BuilderUI',
    subtitle: 'Management System',
    icon:     'dashboard',
  },
  user: {
    name:   'Ruki Nasa',
    role:   'Admin',
  },
  items: [
    {
      label:     'Dashboard',
      icon:      'dashboard',
      path:      '/dashboard',
      isDefault: true,
      line:      false,
      content:   (user) => DashboardPage(user),
    },
    {
      label:     'Assets',
      icon:      'assets',
      path:      '/assets',
      isDefault: true,
      line:      false,
      content:   (user) => AssetsPage(user),
    },
    {
      label:     'Assets',
      icon:      'assets',
      path:      '/newassetsform',
      isDefault: true,
      line:      false,
      hidden:    true,
      content:   (user) => NewAssetsForm(user),
    },
    {
      label:     'Support',
      icon:      'support',
      path:      '/support',
      isDefault: true,
      line:      false,
      content:   (user) => SupportPage(user),
    },
    {
      label:     'Repair History',
      icon:      'repair-history',
      path:      '/repair-history',
      isDefault: true,
      line:      false,
      content:   (user) => RepairHistoryPage(user),
    },
    {
      label:     'Monitoring',
      icon:      'monitoring',
      path:      '/monitoring',
      isDefault: true,
      line:      false,
      content:   (user) => MonitoringPage(user),
    },
    {
      label:     'Activity Logs',
      icon:      'activity-logs',
      path:      '/activity-logs',
      isDefault: true,
      line:      false,
      content:   (user) => ActivityLogsPage(user),
    },
    {
      label:     'Users',
      icon:      'user',
      path:      '/users',
      isDefault: true,
      line:      false,
      content:   () => AdminUsersPage(),
    },
    {
      label:     'Cases',
      icon:      'clipboard',
      path:      '/cases',
      isDefault: true,
      line:      false,
      content:   () => CasesPage(),
    },
    {
      label:     'User Profile',
      icon:      'user',
      path:      '/user-profile',
      isDefault: false,
      line:      false,
      hidden:    true,
      content:   (user) => UserProfilePage(user),
    },
  ],
}
