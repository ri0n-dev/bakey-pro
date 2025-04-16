import Image from "next/image";
import bakey from "@/assets/bakey.svg";

export default function Header() {
    return (
        <>
                <header className="flex items-center p-4 box-border">
                    <a href="/home/">
                        <Image src={bakey} className="object-contain" width={35} height={35} alt="Bakey" />
                    </a>
                </header>
        </>
    );
}