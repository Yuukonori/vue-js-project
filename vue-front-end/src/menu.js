import { DashboardPage } from './pages/dashboard.js'
import { AssetsPage } from './pages/assets.js'
import { SupportPage } from './pages/support.js'
import { RepairHistoryPage } from './pages/repairhistory.js'
import { UserListPage } from './pages/userlist.js'
import { MonitoringPage } from './pages/monitoring.js'
import { ActivityLogsPage } from './pages/activitylog.js'
import { NewAssetsForm } from './pages/form/newAssetsForm.js'

export const MENU_CONFIG = {
  header: {
    title:    'BuilderUI',
    subtitle: 'Management System',
    icon:     'dashboard',
  },
  user: {
    avatar: 'https://i.pravatar.cc/32?img=3',
    name:   'Alex Kim',
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
      label:     'User List',
      icon:      'user',
      path:      '/userlist',
      isDefault: false,
      line:      false,
      hidden:    true,
      content:   (user) => UserListPage(user),
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
  ],
}

