import { IdCard, Keyboard, LayoutDashboard, Settings, Package, Users } from 'lucide-react'

export const ADMIN_MENUS = [
  { id: 1, title: 'Profile', path: '/admin', icon: IdCard },
  { id: 2, title: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { id: 3, title: 'Portfolio', path: '/admin/portfolio', icon: Package },
  { id: 4, title: 'Tech Stack', path: '/admin/tech-stack', icon: Users },
  { id: 5, title: 'Blog', path: '/admin/blog', icon: Settings },
  { id: 6, title: 'Journey', path: '/admin/journey', icon: LayoutDashboard },
  { id: 7, title: 'Typing Text', path: '/admin/typing-text', icon: Keyboard },
]
