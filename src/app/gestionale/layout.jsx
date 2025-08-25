'use client'
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { supabase } from "../../../lib/supabaseClient"
import Image from "next/image"
import MenuSidebar from "../componenti/menuGestionaleSidebar"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons"

const ICONoff = <FontAwesomeIcon icon={faRightFromBracket}/>

export default function LAYOUTPizzeria({ children }) {

    const [user, setUser] = useState(null)
    const router = useRouter()
    const [nomeSede, setNomeSede] = useState("")

    //LOGOUT
    async function handleLogout() {
    await supabase.auth.signOut()
    router.push("/")
    }  

    return (
    <>
    <div className="grid grid-cols-12 grid-rows-12 h-screen w-screen md:p-5 p-1 justify-center items-center bg-neutral-300">
        <div className="shadow-xl z-50 rounded-t-2xl col-span-12 row-span-1 col-start-1 row-start-1 h-[100%] bg-brand p-5 flex lg:items-center lg:justify-between md:items-start md:justify-between items-center justify-between">
            <div className="flex flex-row items-center gap-5">
                <Image src={"/logo-fullwhite.png"} width={70} height={50} alt="logo michele in the world"/>
            </div>
            <div className="">

            </div>
            <div className="flex flex-row gap-2">
                <button
                    onClick={handleLogout}
                    className="py-1 px-2 w-fit text-xs bg-red-600 text-white rounded hover:bg-red-800"
                >
                    {ICONoff} ESCI
                </button>
            </div>
        </div>
        <div className="md:rounded-bl-2xl md:col-span-1 col-span-12 md:row-span-11 row-span-1 col-start-1 row-start-2 h-full bg-neutral-800 p-5 flex lg:items-end lg:justify-end md:items-start md:justify-center items-center justify-center"><MenuSidebar/></div>
        <div className="md:col-span-11 col-span-12 md:row-span-11 row-span-10 md:col-start-2 col-start-1 md:row-start-2 row-start-3 h-full bg-neutral-100 md:p-7 p-1 overflow-auto">{children}</div>
    </div>
    </>    
    )
}