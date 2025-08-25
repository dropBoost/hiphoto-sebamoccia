'use client'

import { useState, useEffect } from "react";
import { supabase } from "../../../../lib/supabaseClient";

export default function UploadPhotoForm() {
  const [file, setFile] = useState(null);
  const [galleryId, setGalleryId] = useState("");
  const [galleries, setGalleries] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Carica le gallery
  useEffect(() => {
    const fetchGalleries = async () => {
      const { data, error } = await supabase.from("galleries").select("id, title");
      if (!error) setGalleries(data);
    };
    fetchGalleries();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !galleryId) {
      setMessage("Seleziona un file e una gallery");
      return;
    }

    setLoading(true);
    setMessage("");

    const filePath = `${galleryId}/${Date.now()}_${file.name}`;

    const { data: storageData, error: storageError } = await supabase
      .storage
      .from("gallery-photos")
      .upload(filePath, file);

    if (storageError) {
      console.error(storageError);
      setMessage("Errore durante il caricamento nello storage");
      setLoading(false);
      return;
    }

    const { publicUrl, error: urlError } = supabase
      .storage
      .from("gallery-photos")
      .getPublicUrl(filePath);

    if (urlError) {
      console.error(urlError);
      setMessage("Errore nel recupero URL");
      setLoading(false);
      return;
    }

    const { error: dbError } = await supabase.from("photos").insert({
      gallery_id: galleryId,
      storage_path: publicUrl,
      title,
      description,
    });

    if (dbError) {
      console.error(dbError);
      setMessage("Errore nel salvataggio nel DB");
      setLoading(false);
      return;
    }

    setMessage("Foto caricata con successo!");
    setFile(null);
    setTitle("");
    setDescription("");
    setGalleryId("");
    setLoading(false);
  };

  return (
    <form onSubmit={handleUpload} className="flex flex-col gap-2 w-full max-w-md">
      <select value={galleryId} onChange={e => setGalleryId(e.target.value)} className="p-2 border rounded">
        <option value="">Seleziona gallery</option>
        {galleries.map(g => (
          <option key={g.id} value={g.id}>{g.title}</option>
        ))}
      </select>

      <input type="file" onChange={e => setFile(e.target.files[0])} accept="image/*" />
      <input 
        type="text" 
        placeholder="Titolo foto" 
        value={title} 
        onChange={e => setTitle(e.target.value)} 
        className="p-2 border rounded"
      />
      <input 
        type="text" 
        placeholder="Descrizione" 
        value={description} 
        onChange={e => setDescription(e.target.value)} 
        className="p-2 border rounded"
      />
      <button type="submit" disabled={loading} className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
        {loading ? "Caricamento..." : "Carica Foto"}
      </button>
      {message && <p className="text-sm mt-2">{message}</p>}
    </form>
  )
}
