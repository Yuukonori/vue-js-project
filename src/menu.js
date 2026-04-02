import { DashboardPage } from './pages/dashboard.js'

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
  ],
}
