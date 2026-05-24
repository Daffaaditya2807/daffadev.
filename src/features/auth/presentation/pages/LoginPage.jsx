import { useEffect, useState } from 'react'
import { Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { supabase } from '@/core/supabase'

const LoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from?.pathname || '/admin'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()

      if (data.session) {
        navigate(redirectTo, { replace: true })
      }
    }

    checkSession()
  }, [navigate, redirectTo])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrorMessage('')
    setIsLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setIsLoading(false)

    if (error) {
        console.error('Login error:', error)
      setErrorMessage('Email atau password tidak sesuai.')
      return
    }

    navigate(redirectTo, { replace: true })
  }

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-2xl border border-white/10 bg-white/4 shadow-2xl shadow-black/50 backdrop-blur-xl lg:grid-cols-[1fr_0.9fr]">
          <section className="hidden min-h-155 flex-col justify-between border-r border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.10),rgba(255,255,255,0.02))] p-10 lg:flex">
            <Link to="/" className="flex items-center gap-3 text-sm font-semibold text-white">
              <span className="flex size-10 items-center justify-center rounded-lg bg-white text-black">
                D
              </span>
              DaffaDev Admin
            </Link>

            <div className="max-w-md space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium text-white/70">
                <ShieldCheck className="size-4" />
                Secure admin access
              </div>
              <div className="space-y-4">
                <h1 className="text-5xl font-semibold leading-tight tracking-tight text-white">
                  Kelola portfolio dari satu dashboard.
                </h1>
                <p className="text-base leading-7 text-white/60">
                  Masuk untuk mengatur konten, data proyek, dan informasi admin. Integrasi Supabase bisa dipasang di form ini.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-sm">
              {['Content', 'Projects', 'Profile'].map((item) => (
                <div key={item} className="rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-white/65">
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="flex min-h-155 items-center justify-center px-4 py-10 sm:px-8">
            <Card className="w-full max-w-md rounded-xl border-white/10 bg-black/40 py-0 text-white shadow-none ring-white/10">
              <CardContent className="px-6 py-8 sm:px-8">
                <div className="mb-8 space-y-2">
                  <Link to="/" className="mb-6 flex w-fit items-center gap-3 text-sm font-semibold text-white lg:hidden">
                    <span className="flex size-10 items-center justify-center rounded-lg bg-white text-black">
                      D
                    </span>
                    DaffaDev Admin
                  </Link>
                  <p className="text-sm font-medium text-white/50">Welcome back</p>
                  <h2 className="text-3xl font-semibold tracking-tight text-white">Login Admin</h2>
                  <p className="text-sm leading-6 text-white/55">
                    Gunakan email dan password yang terdaftar untuk masuk ke dashboard.
                  </p>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-white/80">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/35" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="admin@daffadev.com"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                        className="h-11 border-white/10 bg-white/6 pl-10 text-white placeholder:text-white/30 focus-visible:border-white/35 focus-visible:ring-white/10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <label htmlFor="password" className="text-sm font-medium text-white/80">
                        Password
                      </label>
                      <button type="button" className="text-xs font-medium text-white/45 transition hover:text-white">
                        Lupa password?
                      </button>
                    </div>
                    <div className="relative">
                      <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/35" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        placeholder="Masukkan password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                        className="h-11 border-white/10 bg-white/6 px-10 text-white placeholder:text-white/30 focus-visible:border-white/35 focus-visible:ring-white/10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((current) => !current)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/35 transition hover:text-white"
                        aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                      >
                        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                  </div>

                  {errorMessage && (
                    <div className="rounded-lg border border-red-400/20 bg-red-500/10 px-3 py-2 text-sm text-red-100">
                      {errorMessage}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="h-11 w-full bg-white text-black hover:bg-white/90"
                  >
                    {isLoading ? 'Memproses...' : 'Masuk'}
                  </Button>
                </form>

                <p className="mt-6 text-center text-xs leading-5 text-white/35">
                  Akses dashboard hanya tersedia untuk akun admin yang terdaftar.
                </p>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </main>
  )
}

export default LoginPage
