const USER_ROLES = [
  'Support Specialist',
  'Network Engineer',
  'Operations Manager',
  'Field Technician',
]

export const USERS = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  role: USER_ROLES[i % USER_ROLES.length],
  avatar: `https://i.pravatar.cc/64?img=${(i % 70) + 1}`,
}))
