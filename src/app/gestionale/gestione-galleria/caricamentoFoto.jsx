'use client'

import { useEffect, useRef, useState } from 'react'
import { supabase } from '../../../../lib/supabaseClient'
import { data } from 'autoprefixer'

export default function CaricamentoFotoBatch(props) {
  const [files, setFiles] = useState([])
  const [galleryId, setGalleryId] = useState('')
  const [galleries, setGalleries] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [progressMap, setProgressMap] = useState({})
  const fileInputRef = useRef(null)
  const onDisplay = props.onDisplay
  const [dataGallery, setDataGallery] = useState([])

  // Carica le gallery
  useEffect(() => {
    ;(async () => {
      const { data, error } = await supabase
        .from('galleries')
        .select('id, title')
        .order('title', { ascending: true })

      if (error) {
        console.error(error)
        setMessage('Errore nel recupero delle gallery')
        return
      }
      setGalleries(data || [])
    })()
  }, [])

  const handleFilesChange = (list) => {
    const arr = Array.from(list || [])
    setFiles(arr)
    const p = {}
    arr.forEach((f) => (p[f.name] = 0))
    setProgressMap(p)
  }

  // La SDK Storage non espone eventi di progresso: segnamo 100% a fine upload
  const setFileProgress = (name, value) => {
    setProgressMap((prev) => ({ ...prev, [name]: value }))
  }

  const getImageDims = (file) =>
    new Promise((resolve) => {
      const img = new Image()
      img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight })
      img.src = URL.createObjectURL(file)
    })

  const handleUpload = async (e) => {
    e.preventDefault()

    if (!galleryId) return setMessage('Seleziona una gallery.')
    if (!files.length) return setMessage('Seleziona uno o più file immagine.')

    // Validazioni base
    const maxSizeMB = 10
    for (const f of files) {
      if (!f.type.startsWith('image/')) {
        setMessage(`"${f.name}" non è un file immagine.`)
        return
      }
      if (f.size > maxSizeMB * 1024 * 1024) {
        setMessage(`"${f.name}" supera ${maxSizeMB}MB.`)
        return
      }
    }

    setLoading(true)
    setMessage('')

    try {
      // Upload in parallelo
      const results = await Promise.allSettled(
        files.map(async (f) => {
          const { width, height } = await getImageDims(f)
          const ext = f.name.split('.').pop()?.toLowerCase() || 'jpg'
          const safeName = `${crypto.randomUUID()}.${ext}`
          const filePath = `${galleryId}/${safeName}`

          const { error: storageError } = await supabase.storage
            .from('gallery-photos') // bucket
            .upload(filePath, f, {
              cacheControl: '3600',
              upsert: false,
              contentType: f.type
            })

          if (storageError) {
            throw new Error(`Upload "${f.name}" fallito: ${storageError.message}`)
          }

          // URL pubblico (solo se bucket pubblico)
          const { data: pub } = supabase.storage.from('gallery-photos').getPublicUrl(filePath)

          setFileProgress(f.name, 100)

          return {
            original_name: f.name,
            storage_path: filePath,
            public_url: pub?.publicUrl ?? null,
            mime: f.type,
            size: f.size,
            width,
            height
          }
        })
      )

      const successItems = results.filter((r) => r.status === 'fulfilled').map((r) => r.value)
      const fails = results.filter((r) => r.status === 'rejected').map((r) => r.reason?.message || String(r.reason))

      if (!successItems.length) {
        setMessage('Nessuna immagine caricata.')
        setLoading(false)
        return
      }

      // ✅ Soluzione A: usa la prima immagine come "cover" per rispettare NOT NULL su storage_path
      const coverPath = successItems[0].storage_path
      const coverPublicUrl = successItems[0].public_url ?? null

      // Un solo INSERT con items_jsonb e storage_path valorizzato
      const { error: dbError } = await supabase.from('photos').insert({
        gallery_id: galleryId,
        title: title || null,
        description: description || null,
        storage_path: coverPath,          // cover obbligatoria
        // public_url: coverPublicUrl,    // <-- lascia SOLO se hai questa colonna
        items_jsonb: successItems         // array completo di oggetti immagine
      })

      if (dbError) {
        console.error(dbError)
        setMessage(`Errore DB: ${dbError.message}`)
        setLoading(false)
        return
      }

      let msg = `Caricamento completato: ${successItems.length} immagini salvate in un solo record`
      if (fails.length) msg += `, ${fails.length} errori.`
      setMessage(msg)

      // Reset UI
      setFiles([])
      setTitle('')
      setDescription('')
      setGalleryId('')
      setProgressMap({})
      if (fileInputRef.current) fileInputRef.current.value = ''

      if (typeof props.onSuccess === 'function') {
        props.onSuccess({ galleryId, count: successItems.length, items: successItems, coverPath, coverPublicUrl })
      }
    } catch (err) {
      console.error(err)
      setMessage('Errore imprevisto durante il caricamento.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('galleries')
        .select('id, title')
        .order('title', { ascending: true })

      if (error) {
        console.error(error)
        setMessage('Errore nel recupero delle gallery')
        return
      }
      setDataGallery(data)
    })()
  }, [])

  return (
    <>
      <div className={`${onDisplay === 'on' ? '' : 'hidden'}`}>
        <form onSubmit={handleUpload} className="flex flex-col gap-2 w-full max-w-md">
          <select
            value={galleryId}
            onChange={(e) => setGalleryId(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">Seleziona gallery</option>
            {galleries.map((g) => (
              <option key={g.id} value={g.id}>
                {g.title}
              </option>
            ))}
          </select>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={(e) => handleFilesChange(e.target.files)}
            accept="image/*"
          />

          {!!files.length && (
            <div className="border rounded p-2 space-y-2">
              {files.map((f) => (
                <div key={f.name} className="text-sm">
                  <div className="flex justify-between">
                    <span className="truncate max-w-[70%]">{f.name}</span>
                    <span>{(f.size / (1024 * 1024)).toFixed(2)} MB</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded mt-1 overflow-hidden">
                    <div
                      className="h-2 bg-brand transition-all"
                      style={{ width: `${progressMap[f.name] || 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          <input
            type="text"
            placeholder="Titolo batch (opzionale)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="p-2 border rounded"
          />

          <input
            type="text"
            placeholder="Descrizione batch (opzionale)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="p-2 border rounded"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-brand text-white py-2 rounded hover:bg-brand disabled:opacity-60"
          >
            {loading ? 'Caricamento...' : `Carica ${files.length ? files.length : ''} Foto`}
          </button>

          {message && <p className="text-sm mt-2">{message}</p>}
        </form>
        <div className='border h-50'>
          {dataGallery.map((galleria, i)=>(
           <span key={i}> {galleria.title}</span>
          ))}
        </div>
      </div>
    </>
  )
}
