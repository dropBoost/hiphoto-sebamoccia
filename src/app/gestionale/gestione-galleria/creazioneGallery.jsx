'use client'

import { useEffect, useRef, useState } from 'react'
import { supabase } from "@/lib/supabaseClient"

function slugify(s) {
  return s
    .toString()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .slice(0, 80)
}

export default function CreazioneGallery(props) {
  const onDisplay = props.onDisplay

  const [titolo, setTitolo] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [is_public, setIsPubblic] = useState(false)

  const [categories, setCategories] = useState([])
  const [categoryId, setCategoryId] = useState('')

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [slugTouched, setSlugTouched] = useState(false)
  const titoloRef = useRef(null)

  // auto-slug finché lo slug non viene toccato manualmente
  useEffect(() => {
    if (!slugTouched) setSlug(slugify(titolo))
  }, [titolo, slugTouched])

  // carica categorie
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, slug')
        .order('name', { ascending: true })

      if (error) {
        console.error(error)
        setMessage('Errore nel recupero delle categorie.')
        return
      }
      setCategories(data || [])
    })()
  }, [])

  const validate = () => {
    if (!titolo.trim()) return 'Inserisci un titolo.'
    if (!slug.trim()) return 'Inserisci uno slug.'
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      return 'Lo slug può contenere solo lettere/numeri minuscoli e trattini.'
    }
    if (!categoryId) return 'Seleziona una categoria.'
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')

    const err = validate()
    if (err) {
      setMessage(err)
      return
    }

    setLoading(true)
    try {
      // controllo duplicato slug (opzionale)
      const { data: exists, error: checkErr } = await supabase
        .from('galleries')
        .select('id')
        .eq('slug', slug)
        .limit(1)

      if (checkErr) {
        console.error(checkErr)
        setMessage('Errore nel controllo dello slug.')
        setLoading(false)
        return
      }
      if (exists && exists.length > 0) {
        setMessage('Slug già esistente. Scegline un altro.')
        setLoading(false)
        return
      }

      // inserimento su Supabase con category_id
      const { data, error } = await supabase
        .from('galleries')
        .insert([
          {
            title: titolo,
            slug,
            description: description || null,
            is_public,
            category_id: categoryId, // ⬅️ FK alla tabella categories
          },
        ])
        .select()
        .single()

      if (error) {
        console.error(error)
        setMessage(`Errore DB: ${error.message}`)
        setLoading(false)
        return
      }

      setMessage('Gallery creata con successo!')
      // reset form
      setTitolo('')
      setSlug('')
      setDescription('')
      setIsPubblic(false)
      setSlugTouched(false)
      setCategoryId('')
      if (titoloRef.current) titoloRef.current.focus()

      // callback opzionale
      if (typeof props.onCreated === 'function') {
        props.onCreated(data)
      }
    } catch (err) {
      console.error(err)
      setMessage('Errore imprevisto durante la creazione.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`${onDisplay === 'on' ? '' : 'hidden'}`}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-full max-w-md">
        {/* Titolo */}
        <input
          ref={titoloRef}
          type="text"
          placeholder="Titolo"
          value={titolo}
          onChange={(e) => setTitolo(e.target.value)}
          className="p-2 border rounded"
        />

        {/* Slug (modificabile) */}
        <input
          type="text"
          placeholder="slug-esempio"
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value.toLowerCase())
            setSlugTouched(true)
          }}
          onBlur={() => setSlug((s) => slugify(s))}
          className="p-2 border rounded"
        />

        {/* Categoria */}
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Seleziona categoria</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} {c.slug ? `(${c.slug})` : ''}
            </option>
          ))}
        </select>

        {/* Description */}
        <textarea
          placeholder="Descrizione (opzionale)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="p-2 border rounded"
        />

        {/* is_public */}
        <label className="flex items-center gap-2 select-none">
          <input
            type="checkbox"
            checked={is_public}
            onChange={(e) => setIsPubblic(e.target.checked)}
            className="h-4 w-4"
          />
          Pubblica subito
        </label>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? 'Creazione…' : 'Crea Gallery'}
        </button>

        {message && <p className="text-sm mt-2">{message}</p>}
      </form>
    </div>
  )
}
