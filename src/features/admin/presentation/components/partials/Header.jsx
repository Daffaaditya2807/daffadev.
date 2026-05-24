import { Menu, Search, Bell } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { ADMIN_MENUS } from '../data/menuData'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { supabase } from '@/core/supabase'

const Header = () => {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login', { replace: true })
  }

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-white/10 bg-white/[0.07] px-4 shadow-lg shadow-black/20 backdrop-blur-2xl md:px-6">
      <div className="flex items-center gap-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-white/75 hover:bg-white/10 hover:text-white md:hidden"
            >
              <Menu size={20} />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-64 border-white/10 bg-black/75 p-0 text-white shadow-2xl shadow-black/50 backdrop-blur-2xl"
          >
            <div className="flex h-16 items-center border-b border-white/10 px-6">
              <h2 className="text-xl font-bold text-white">
                Daffadev.
              </h2>
            </div>
            <nav className="space-y-1 px-3 py-4">
              {ADMIN_MENUS.map((menu) => {
                const Icon = menu.icon

                return (
                  <NavLink
                    key={menu.id}
                    to={menu.path}
                    end={menu.path === '/admin'}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm font-medium transition-all ${
                        isActive
                          ? 'border-white/25 bg-white/20 text-white'
                          : 'border-transparent text-white/60 hover:border-white/10 hover:bg-white/10 hover:text-white'
                      }`
                    }
                  >
                    <Icon size={18} />
                    <span>{menu.title}</span>
                  </NavLink>
                )
              })}
            </nav>
          </SheetContent>
        </Sheet>

        <div className="relative hidden w-64 sm:flex">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/45" />
          <Input
            type="search"
            placeholder="Cari menu atau data..."
            className="border-white/10 bg-white/8 pl-9 text-white placeholder:text-white/40 shadow-inner shadow-white/5 backdrop-blur-xl focus-visible:border-white/35 focus-visible:ring-white/20"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="relative text-white/70 hover:bg-white/10 hover:text-white"
        >
          <Bell size={20} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.85)]" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-white/10">
              <Avatar className="h-9 w-9 border border-white/20 shadow-lg shadow-black/25">
                <AvatarImage src="https://github.com/shadcn.png" alt="Profile" />
                <AvatarFallback>DF</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56 border-white/10 bg-black/80 text-white shadow-2xl shadow-black/50 backdrop-blur-2xl"
            align="end"
            forceMount
          >
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Daffa</p>
                <p className="text-xs leading-none text-white/50">Superadmin</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem>Profil Saya</DropdownMenuItem>
            <DropdownMenuItem>Pengaturan</DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem className="text-white/80" onClick={handleLogout}>
              Keluar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

export default Header
