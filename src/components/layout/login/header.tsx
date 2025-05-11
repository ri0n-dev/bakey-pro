import Image from "next/image";
import { Skeleton } from "@/components/ui/Skeleton";
import Bakey from "@/assets/bakey.svg"

export function Header() {
    return (
        <header className="flex items-center p-4 box-border">
            <a href="/home/">
                <Image src={Bakey} className="object-contain" width={35} height={35} alt="Bakey" />
            </a>
        </header>
    )
}

export function HeaderSkeleton() {
    return (
        <header className="flex items-center p-4 box-border">
            <Skeleton className="w-[35px] h-[35px] rounded-full object-contain" />
        </header>
    )
}
