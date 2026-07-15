import { useEffect, useState, useRef } from 'react'
import { Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { supabase } from '@/core/supabase'
import SEO from '@/components/common/SEO'

const LoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from?.pathname || '/admin'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  
  // Captcha states
  const canvasRef = useRef(null)
  const [captchaText, setCaptchaText] = useState('')
  const [captchaAnswer, setCaptchaAnswer] = useState('')

  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  
  const getStoredAttempts = () => parseInt(localStorage.getItem('login_failed_attempts') || '0', 10)
  
  const getStoredCooldown = () => {
    const until = parseInt(localStorage.getItem('login_cooldown_until') || '0', 10)
    const now = new Date().getTime()
    return until > now ? Math.ceil((until - now) / 1000) : 0
  }

  // Anti-spam states
  const [loginAttempts, setLoginAttempts] = useState(getStoredAttempts())
  const [cooldown, setCooldown] = useState(getStoredCooldown())

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
    let text = ''
    for (let i = 0; i < 6; i++) {
      text += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setCaptchaText(text)
    setCaptchaAnswer('')
    
    // Draw on canvas
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Background
    ctx.fillStyle = '#111'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Add noise (dots)
    for (let i = 0; i < 50; i++) {
      ctx.fillStyle = Math.random() > 0.5 ? '#555' : '#888'
      ctx.beginPath()
      ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 2, 0, Math.PI * 2)
      ctx.fill()
    }
    
    // Add noise (lines)
    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = '#444'
      ctx.beginPath()
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height)
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height)
      ctx.stroke()
    }
    
    // Draw text
    ctx.font = 'bold 24px sans-serif'
    ctx.fillStyle = '#fff'
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'center'
    
    for (let i = 0; i < text.length; i++) {
      ctx.save()
      const x = 20 + (i * 20)
      const y = canvas.height / 2 + (Math.random() * 4 - 2)
      ctx.translate(x, y)
      ctx.rotate((Math.random() - 0.5) * 0.4) // Slight rotation
      ctx.fillText(text[i], 0, 0)
      ctx.restore()
    }
  }

  const updateAttempts = (count) => {
    setLoginAttempts(count)
    localStorage.setItem('login_failed_attempts', count.toString())
  }

  const triggerCooldown = (seconds) => {
    setCooldown(seconds)
    localStorage.setItem('login_cooldown_until', (new Date().getTime() + seconds * 1000).toString())
  }

  useEffect(() => {
    generateCaptcha()
  }, [])

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()

      if (data.session) {
        navigate(redirectTo, { replace: true })
      }
    }

    checkSession()
  }, [navigate, redirectTo])

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => {
        const remaining = getStoredCooldown()
        if (remaining <= 0) {
          setCooldown(0)
          if (loginAttempts >= 3) {
            updateAttempts(0)
          }
        } else {
          setCooldown(remaining)
        }
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [cooldown, loginAttempts])

  const handleSubmit = async (event) => {
    event.preventDefault()
    
    if (cooldown > 0) return

    setErrorMessage('')
    
    // Validasi Captcha
    if (captchaAnswer.toLowerCase() !== captchaText.toLowerCase()) {
      setErrorMessage('Jawaban keamanan (Captcha) salah.')
      generateCaptcha()
      
      const newAttempts = loginAttempts + 1
      updateAttempts(newAttempts)
      if (newAttempts >= 3) {
        triggerCooldown(30)
      }
      return
    }

    setIsLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setIsLoading(false)

    if (error) {
      console.error('Login error:', error)
      generateCaptcha()
      
      if (error.status === 429 || error.message.toLowerCase().includes('rate limit')) {
        triggerCooldown(60)
        setErrorMessage('Terlalu banyak permintaan (Spam terdeteksi). Tunggu 60 detik.')
        return
      }

      const newAttempts = loginAttempts + 1
      updateAttempts(newAttempts)

      if (newAttempts >= 3) {
        triggerCooldown(30)
        setErrorMessage('Terlalu banyak percobaan gagal. Silakan tunggu 30 detik.')
      } else {
        setErrorMessage(`Email atau password tidak sesuai. (Percobaan ${newAttempts}/3)`)
      }
      return
    }

    // Reset attempts on successful login
    updateAttempts(0)
    localStorage.removeItem('login_cooldown_until')

    navigate(redirectTo, { replace: true })
  }

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white sm:px-6 lg:px-8">
      <SEO
        title="Login Admin"
        description="Halaman login admin DaffaDev."
        path="/login"
        noIndex
      />

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
                  
                  {/* Captcha Section */}
                  <div className="space-y-2">
                    <label htmlFor="captcha" className="text-sm font-medium text-white/80">
                      Keamanan: Ketik huruf dan angka di bawah
                    </label>
                    <div className="flex gap-3 items-center">
                      <div className="rounded-md border border-white/10 overflow-hidden bg-[#111]">
                        <canvas ref={canvasRef} width="140" height="44" className="block" />
                      </div>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={generateCaptcha}
                        className="h-11 border-white/10 bg-white/5 text-white hover:bg-white/10 shrink-0"
                        title="Acak Ulang Captcha"
                      >
                        Acak
                      </Button>
                    </div>
                    <Input
                      id="captcha"
                      name="captcha"
                      type="text"
                      placeholder="Masukkan teks di atas"
                      value={captchaAnswer}
                      onChange={(event) => setCaptchaAnswer(event.target.value)}
                      required
                      className="h-11 border-white/10 bg-white/6 px-4 text-white placeholder:text-white/30 focus-visible:border-white/35 focus-visible:ring-white/10 mt-2"
                    />
                  </div>

                  {errorMessage && (
                    <div className="rounded-lg border border-red-400/20 bg-red-500/10 px-3 py-2 text-sm text-red-100">
                      {errorMessage}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isLoading || cooldown > 0}
                    className="h-11 w-full bg-white text-black hover:bg-white/90 disabled:opacity-70"
                  >
                    {cooldown > 0 
                      ? `Tunggu ${cooldown} detik...` 
                      : isLoading 
                        ? 'Memproses...' 
                        : 'Masuk'}
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
