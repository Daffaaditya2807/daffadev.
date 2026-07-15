import { useState, useEffect } from 'react'
import { Menu } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { ADMIN_MENUS } from '../data/menuData'
import { Button } from '@/components/ui/button'
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
import * as Dialog from '@radix-ui/react-dialog'
import { supabase } from '@/core/supabase'

const Header = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false)

  useEffect(() => {
    // Fetch logged in user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    // Update time every second
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const handleLogoutClick = (e) => {
    e.preventDefault()
    setIsLogoutDialogOpen(true)
  }

  const confirmLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login', { replace: true })
  }

  const displayName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'Admin'
  const displayRole = user?.user_metadata?.role || 'Superadmin'

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
        
        <div className="hidden md:block text-sm text-white/60">
          {currentTime.toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}{' '}
          -{' '}
          {currentTime.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-white/10">
              <Avatar className="h-9 w-9 border border-white/20 shadow-lg shadow-black/25">
                <AvatarImage src="https://github.com/shadcn.png" alt="Profile" />
                <AvatarFallback>{displayName.substring(0, 2).toUpperCase()}</AvatarFallback>
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
                <p className="text-sm font-medium leading-none capitalize">{displayName}</p>
                <p className="text-xs leading-none text-white/50">{displayRole}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem className="text-white/80 cursor-pointer focus:bg-white/10 focus:text-white" onSelect={handleLogoutClick}>
              Keluar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog.Root open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-white/10 bg-black/90 p-6 text-white shadow-2xl shadow-black/60 outline-none">
            <div className="flex flex-col gap-4">
              <div>
                <Dialog.Title className="text-lg font-semibold text-white">Konfirmasi Keluar</Dialog.Title>
                <Dialog.Description className="mt-2 text-sm text-white/60">
                  Apakah Anda yakin ingin keluar dari halaman dashboard admin?
                </Dialog.Description>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button type="button" variant="outline" onClick={() => setIsLogoutDialogOpen(false)} className="border-white/10 bg-white/6 text-white hover:bg-white/10 hover:text-white">
                  Batal
                </Button>
                <Button type="button" variant="destructive" onClick={confirmLogout}>
                  Ya, Keluar
                </Button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </header>
  )
}

export default Header
