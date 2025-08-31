'use client'

import { useState, useEffect } from "react"
import { supabase } from "../../../../lib/supabaseClient"
import Image from "next/image"
import Link from "next/link"

export default function Matrimoni () {
    
    const [dataGalleries, setDataGalleries] = useState ([])

    // Carica le gallery
    useEffect(() => {
    ;(async () => {
        const { data, error } = await supabase
        .from('photos')
        .select('*')

        if (error) {
        console.error(error)
        return
        }
        setDataGalleries(data || [])
        console.log(data)
    })()
    }, [])

    return (
        <>
        <div className="h-screen w-screen">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
                {dataGalleries.map((galleria) => {
                // Se items_jsonb esiste ed è un array
                const items = galleria.items_jsonb
                const randomIndex = items.length > 0 
                    ? Math.floor(Math.random() * items.length) 
                    : null

                const imageUrl = randomIndex !== null ? items[randomIndex].public_url : "/placeholder.jpg"

                return (
                    <div key={galleria.id} className="rounded-lg h-full w-full border p-5">
                    <Link href={`/gallery/${galleria.id}`}>
                        <Image
                        src={imageUrl}
                        width={300}
                        height={300}
                        alt={galleria.title || "Foto matrimonio"}
                        className="aspect-square object-cover w-full hover:scale-105 transition-transform duration-300"
                        />
                        <h3 className="bg-neutral-300 text-center p-3">{galleria.title}</h3>
                    </Link>
                    </div>
                )
                })}
            </div>
        </div>
        </>
    )
}