import Image from "next/image";
import { poweredBy } from "./cosetting";
import { companyName } from "./cosetting";

export default function Home() {
  return (
    <div className="flex flex-col justify-between items-center bg-brand h-screen w-screen ">
      <div className="flex justify-center items-center p-5 bg-brand-dark w-full">
        <span className="text-white text-sm font-extrabold">COMING SOON</span>
      </div>
      <div className="flex lg:flex-row flex-col justify-center items-center h-[30vh] gap-5">
        <div className="flex lg:h-full h-[30vh] w-full lg:w-[8vw] bg-center bg-cover justify-center items-center border bg-[url(/ritratto.jpg)] rounded-xl p-10">
        
        </div>
        <div className="flex flex-col justify-center items-center border p-5 h-full gap-5 rounded-xl bg-brand-dark/30">
        <Image src={'/logo-fullwhite.png'} width={80} height={100}/>
        <hr className="border border-brand-light w-full" />
        <h1 className="text-brand-light/30">{companyName}</h1>
        </div>
      </div>
      <div className="flex justify-center items-center p-5 bg-brand-light w-full">
        <span className="text-xs">{poweredBy}</span>
      </div>
    </div>
  );
}
