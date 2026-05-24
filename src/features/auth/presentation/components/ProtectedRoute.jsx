import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { supabase } from '@/core/supabase'

const ProtectedRoute = ({ children }) => {
  const location = useLocation()
  const [isChecking, setIsChecking] = useState(true)
  const [session, setSession] = useState(null)

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()

      setSession(data.session)
      setIsChecking(false)
    }

    checkSession()

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession)
      setIsChecking(false)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black px-4 text-sm font-medium text-white/60">
        Memeriksa akses admin...
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}

export default ProtectedRoute
