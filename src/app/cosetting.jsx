import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook, faInstagram, faTiktok, faWhatsapp } from "@fortawesome/free-brands-svg-icons"
import { faEnvelope, faSquarePhone, faGauge, faPhotoFilm, faCalendar, faKeyboard, faFolderOpen } from '@fortawesome/free-solid-svg-icons'

const ICONfacebook = <FontAwesomeIcon icon={faFacebook}/>
const ICONwhatsApp = <FontAwesomeIcon icon={faWhatsapp}/>
const ICONtikTok = <FontAwesomeIcon icon={faTiktok}/>
const ICONinstagram = <FontAwesomeIcon icon={faInstagram}/>
const ICONtel = <FontAwesomeIcon icon={faSquarePhone}/>
const ICONemail = <FontAwesomeIcon icon={faEnvelope}/>

const ICONone = <FontAwesomeIcon icon={faGauge}/>
const ICONtwo = <FontAwesomeIcon icon={faPhotoFilm}/>
const ICONthree = <FontAwesomeIcon icon={faCalendar}/>
const ICONfour = <FontAwesomeIcon icon={faKeyboard}/>
const ICONfive = <FontAwesomeIcon icon={faFolderOpen}/>

// FOOTER SIGN
export const poweredBy = "powered 💜 dropboost.it"

// PERSONALIZZAZIONI

export const companyName = "SEBA MOCCIA - Photography"
export const logoDark = "/logo-black.png"
export const logoLight = "/logo-white.png"
export const logoFullDark = "/logo-fullblack.png"
export const logoFullLight = "/logo-fullwhite.png"
export const logoExtendedDark = "/logo-extended-black.png"
export const logoExtendedLight = "/logo-extended-white.png"
export const logoExtendedFullDark = "/logo-extended-fullblack.png"
export const logoExtendedFullLight = "/logo-extended-fullwhite.png"
export const colorBrand = "#00597d"
export const colorDark = "#222222"
export const whatsAppContactLink = "#"
export const emailContact = "info@sebamoccia.it"

// SOCIAL

export const socialLink = [
    {name:'whatsApp',link:'https://www.whatsapp.com',icon: ICONwhatsApp, info:"+39 366 35 85 395",attivoWeb:"true"},
    {name:'facebook',link:'fasc',icon: ICONfacebook, info:"@facebbok",attivoWeb:"true"},
    {name:'instagram',link:'#',icon: ICONinstagram, info:"@instagram",attivoWeb:"true"},
    {name:'tiktok',link:'#',icon: ICONtikTok, info:"@tiktok",attivoWeb:"true"},
    {name:'email',link:'#',icon: ICONemail, info:"info@sebamoccia.it",attivoWeb:"true"},
    {name:'tel',link:'dsda',icon: ICONtel, info:"+393293968096",attivoWeb:"true"},
  ]

// MODULI GESTIONALE

export const moduliGestionale = [
    {name:'dashboard', link:'/gestionale/dashboard', linkActive:'dashboard', icon: ICONone, label:'dashboard', attivo:'true'},
    {name:'gestione galleria', link:'/gestionale/gestione-galleria', linkActive:'gestione-galleria', icon: ICONtwo, label:'gestione galleria', attivo:'true'},
    {name:'agenda eventi', link:'/gestionale/agenda-eventi', linkActive:'agenda-eventi', icon: ICONthree, label:'agenda eventi', attivo:'true'},
    {name:'redazione preventivi', link:'/redazione/gestione-preventivi', linkActive:'redazione-preventivi', icon: ICONfour, label:'redazione preventivi', attivo:'true'},
    {name:'gestione preventivi', link:'/gestionale/gestione-preventivi', linkActive:'gestione-preventivi', icon: ICONfive, label:'gestione preventivi', attivo:'true'},
  ]