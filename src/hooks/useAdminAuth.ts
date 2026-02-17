import { useEffect, useState } from 'react'
import { shouldRequireAdminAuth, supabase } from '../lib/supabase'

export function useAdminAuth() {
  const authEnabled = shouldRequireAdminAuth && Boolean(supabase)
  const [loading, setLoading] = useState(authEnabled)
  const [isAuthed, setIsAuthed] = useState(!authEnabled)
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    if (!authEnabled || !supabase) return

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      const user = data.session?.user
      setIsAuthed(Boolean(user))
      setEmail(user?.email || null)
      setLoading(false)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user
      setIsAuthed(Boolean(user))
      setEmail(user?.email || null)
      setLoading(false)
    })

    return () => {
      mounted = false
      sub.subscription.unsubscribe()
    }
  }, [authEnabled])

  async function sendMagicLink(emailAddress: string) {
    if (!supabase) throw new Error('Supabase is not configured')
    const { error } = await supabase.auth.signInWithOtp({
      email: emailAddress,
      options: {
        emailRedirectTo: `${window.location.origin}/admin`,
      },
    })
    if (error) throw error
  }

  async function signOut() {
    if (!supabase) return
    await supabase.auth.signOut()
  }

  return {
    loading,
    isAuthed,
    email,
    sendMagicLink,
    signOut,
    authEnabled,
  }
}

