"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { poweredBy } from "../cosetting"

export default function Home() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // 🔹 Redirect automatico se già loggato
  useEffect(() => {
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.push("/gestionale") // se già loggato vai al gestionale
      }
    }
    checkSession()
  }, [router])

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)

    // Login con email e password (direct su auth.users)
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      alert(error.message)
      setLoading(false)
      return
    }

    // Login ok → redirect
    router.push("/gestionale")
  }

  return (
    <div className="flex flex-col justify-center items-center w-screen h-screen bg-brand">
      <Image src="/logo-fullwhite.png" width={150} height={100} className="" alt="logo"/>
      <form onSubmit={handleLogin} className="grid gap-2 w-64">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="p-2 border rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-brand-dark text-white py-2 rounded hover:bg-brand-light hover:text-brand"
        >
          {loading ? "Caricamento..." : "ENTRA"}
        </button>
      </form>
      <div className="mt-5">
        <span className="text-white text-xs">{poweredBy}</span>
      </div>
    </div>
  )
}
