'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome  } from '@fortawesome/free-solid-svg-icons';
import { moduliGestionale } from '@/app/cosetting';

const iconaHome = <FontAwesomeIcon icon={faHome} className='max-h-[15px]'  />

export default function MenuSidebar () {

    const pathname = usePathname();

    // Modifica qui: isActive controlla se pathname inizia con 'path'
    const isActive = (path) => pathname?.startsWith(path);
    const isActiveHome = (path) => pathname == path;

    return (
        <ul className="flex flex-row md:flex-col gap-2">
        <li>
            <Link
            href={`/gestionale`}
            title={`GESTIONALE`}
            className={`flex items-center justify-center rounded-full p-2 md:h-[40px] md:w-[40px] h-[30px] w-[30px] transition duration-700 ${
                isActiveHome(`/gestionale`) ? 'bg-brand text-neutral-100' : 'bg-neutral-100 text-brand hover:bg-brand hover:text-neutral-200'
            }`}
            >
            {iconaHome}
            </Link>
        </li>
        {moduliGestionale
            .filter(moduli => moduli.attivo === "true")
            .map(modulo => (
            <li key={modulo.name}>
                <Link
                href={`${modulo.link}`}
                title={modulo.linkActive}
                className={`flex items-center justify-center rounded-full p-2 md:h-[40px] md:w-[40px] h-[30px] w-[30px] transition duration-700 ${
                    isActive(`/gestionale/${modulo.linkActive}`) ? 'bg-brand text-neutral-100' : 'bg-neutral-100 text-brand hover:bg-brand hover:text-neutral-200'
                }`}
                >
                {modulo.icon}
                </Link>
            </li>
            ))
        }
        </ul>
    );
}
