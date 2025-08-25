"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../../lib/supabaseClient"
import { useRouter } from "next/navigation"
import MENUhomepage from "../componenti/menuGestionale"

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        router.push("/login") // non loggato → login
      } else {
        setUser(session.user)
      }
      setLoading(false)
    }

    getUser()
  }, [router])

  if (loading) return <p>Caricamento...</p>

  if (!user) return null // 👈 evita flicker contenuto non autorizzato

  return (
    <div className="flex flex-col gap-3 w-full h-full">
      <div className="p-5 rounded-lg">
        <MENUhomepage/>
      </div>
    </div>
  )
}
