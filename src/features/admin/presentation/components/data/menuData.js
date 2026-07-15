import { IdCard, Keyboard, LayoutDashboard, FileText, Layers, Route, Briefcase } from 'lucide-react'

export const ADMIN_MENUS = [
  { id: 1, title: 'Profile', path: '/admin', icon: IdCard },
  { id: 2, title: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { id: 3, title: 'Portfolio', path: '/admin/portfolio', icon: Briefcase },
  { id: 4, title: 'Tech Stack', path: '/admin/tech-stack', icon: Layers },
  { id: 5, title: 'Blog', path: '/admin/blog', icon: FileText },
  { id: 6, title: 'Journey', path: '/admin/journey', icon: Route },
  { id: 7, title: 'Typing Text', path: '/admin/typing-text', icon: Keyboard },
]
