import { DashboardPage } from './pages/dashboard.js'
import { SupportPage } from './pages/support.js'
import { UserListPage } from './pages/userlist.js'

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

