'use client'

import { useState, useEffect, useRef } from "react";

import CaricamentoFoto from "./caricamentoFoto";
import CreazioneGallery from "./creazioneGallery";
import CreazioneCategorie from "./creazioneCategorie";

export default function UploadPhotoForm() {

  const [onDisplayGallery, setOnDisplayGallery] = useState("on")
  const [onDisplayCreateGallery, setOnDisplayCreateGallery] = useState("off")
  const [onDisplayCategories, setOnDisplayCategories] = useState("off")

  // function DisplayManagement () {

  //   if (onDisplayGallery == "off") {
  //     setOnDisplayGallery("on")
  //     setOnDisplayCreateGallery("off")
  //   } else {
  //     setOnDisplayGallery("off")
  //     setOnDisplayCreateGallery("on")
  //   }
  // }

  function ClickCreazioneGallery () {
    setOnDisplayGallery("off")
    setOnDisplayCreateGallery("on")
    setOnDisplayCategories("off")
  }

  function ClickGallery () {
    setOnDisplayGallery("on")
    setOnDisplayCreateGallery("off")
    setOnDisplayCategories("off")
  }

  function ClickCategories () {
    setOnDisplayGallery("off")
    setOnDisplayCreateGallery("off")
    setOnDisplayCategories("on")
  }

  return (
    <>
    <div className="grid grid-cols-12 grid-rows-12 h-full w-full md:gap-4 gap-1  justify-center items-center">
      <div className="lg:col-span-9 col-span-12 col-start-1 lg:row-span-1 row-span-1 row-start-1 h-full rounded-2xl flex items-center justify-start">
        <button
        className={` text-xs font-bold flex items-center border rounded-2xl px-3 py-1
        ${onDisplayCreateGallery === "on" ? `text-neutral-100 bg-brand  border-brand` : `text-brand border border-brand`}
        flex items-center justify-center text-2xl ms-2 `}
        onClick={() => ClickCreazioneGallery()}>CREAZIONE GALLERY
        </button>
        <button
        className={` text-xs font-bold flex items-center border rounded-2xl px-3 py-1
        ${onDisplayGallery === "on" ? `text-neutral-100 bg-brand  border-brand` : `text-brand border border-brand`}
        flex items-center justify-center text-2xl ms-2 `}
        onClick={() => ClickGallery()}>UPLOAD FOTO GALLERY</button>
        <button
        className={` text-xs font-bold flex items-center border rounded-2xl px-3 py-1
        ${onDisplayCategories === "on" ? `text-neutral-100 bg-brand  border-brand` : `text-brand border border-brand`}
        flex items-center justify-center text-2xl ms-2 `}
        onClick={() => ClickCategories()}>CREAZIONE CATEGORIE</button>
      </div>
      <div className="lg:p-5 p-4 pe-5 justify-center lg:col-span-12 col-span-12 col-start-1 lg:row-span-11 row-span-11 row-start-2 h-full bg-neutral-800/50 rounded-2xl overflow-auto">
        <CaricamentoFoto onDisplay={onDisplayGallery}/>
        <CreazioneGallery onDisplay={onDisplayCreateGallery}/>
        <CreazioneCategorie onDisplay={onDisplayCategories}/>
      </div>
    </div>
    
    </>
  );
}
