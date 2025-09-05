'use client'

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import Image from "next/image"
import { companyName } from "@/app/cosetting"

export default function Album ({params}) {

    const album = params.album

    const [dataGalleries, setDataGalleries] = useState ([])
    const [statusPopUp, setStatusPopUp] = useState('hidden')
    const [imageLink, setImageLink] = useState('')

    // Carica le gallery
    useEffect(() => {
    (async () => {
        const { data, error } = await supabase
        .from("photos")
        .select(`*, categoriesID (id, name)`)
        .eq("gallery_id", album)

        if (error) {
        console.error(error)
        return
        }
        setDataGalleries(data || [])
        console.log(data)
    })()
    }, [album])

    const popup = (link) => {
    if (statusPopUp == 'hidden'){
        setStatusPopUp('')
        setImageLink(link)
    }else{
        setStatusPopUp('hidden')
    }
    console.log("Bottone cliccato!")
    }

    return (
        <>
        <div className="h-screen w-screen bg-brand overflow-auto z-0">
            <h2>{params.album}</h2>
            <h1>CIAO</h1>
           
                {dataGalleries.map((album) => {
                return (
                    <div key={album.id} className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 border border-dark">
                        {album.items_jsonb.map((image, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => popup(image.public_url)}
                                className="border"
                            >
                                <Image
                                src={image.public_url}
                                width={image.width}
                                height={image.height}
                                quality={30}
                                alt={`${companyName} - ${album.categoriesID.name} - ${album.title}` || "Foto matrimonio"}
                                className="aspect-square object-cover w-full hover:scale-105 transition-transform duration-300"
                                />
                            </button>
                        ))}
                    </div>
                )
                })}
        </div>
        <div
            id="popupfoto"
            className={`fixed inset-0 z-50 ${statusPopUp}`}
            style={{
                backgroundImage: imageLink ? `url(${imageLink})` : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
            >
            <button onClick={popup} className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded">
                CHIUDI
            </button>
        </div>

        </>
    )
}
