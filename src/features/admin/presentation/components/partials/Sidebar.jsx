import { NavLink } from 'react-router-dom'
import { ADMIN_MENUS } from '../data/menuData'

const Sidebar = () => {
  return (
    <aside className="relative z-20 hidden h-screen w-64 shrink-0 flex-col border-r border-white/10 bg-white/[0.07] shadow-2xl shadow-black/40 backdrop-blur-2xl md:flex">
      <div className="relative flex h-16 items-center border-b border-white/10 px-6">
        <h2 className="text-xl font-bold tracking-tight text-white">
          Daffadev.
        </h2>
      </div>

      <nav className="relative flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {ADMIN_MENUS.map((menu) => {
          const Icon = menu.icon

          return (
            <NavLink
              key={menu.id}
              to={menu.path}
              end={menu.path === '/admin'}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'border-white/25 bg-white/20 text-white shadow-lg shadow-black/30'
                    : 'border-transparent text-white/60 hover:border-white/10 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Icon size={18} className="shrink-0" />
              <span>{menu.title}</span>
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}

export default Sidebar
