"use client";

import { useTheme } from "next-themes"
import { useUser } from "@/hooks/useUser"
import { useBlock } from "@/hooks/useBlock"
import { useState, useEffect } from "react";
import { Toaster, ToasterProps, toast } from "sonner"
import { Skeleton } from "@/components/ui/Skeleton"
import { Button } from "@/components/ui/Button"
import { Label } from "@/components/ui/Label"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import DynamicIcon from "@/libs/DynamicIcon"
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/Dialog"
import { GripHorizontal } from "lucide-react"

export default function Block() {
    const { theme = "system" } = useTheme()
    const { uid, loading } = useUser()
    const { block } = useBlock()
    const [blocks, setBlocks] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (block) {
            setBlocks(block);
            setIsLoading(false);
        }
        setIsLoading(false);
    }, [block]);

    if (loading || isLoading) {
        return (
            <>
                <Toaster theme={theme as ToasterProps["theme"]} />
                <Skeleton className="h-30 w-full mb-2" />
                <Skeleton className="h-50 w-full mb-2" />
                <Skeleton className="h-30 w-full mb-2" />
            </>
        )
    }

    if (!blocks || blocks.length === 0) {
        return (
            <>
                <Toaster theme={theme as ToasterProps["theme"]} />
                <div className="text-center text-neutral-400 py-12">No blocks found</div>
            </>
        )
    }

    return (
        <>
            <Toaster theme={theme as ToasterProps["theme"]} />

            {blocks.map((block, index) => {
                console.log('Rendering block:', block)
                if (block.type === "ImageLink") {
                    return (
                        <div key={index} className="flex flex-col h-auto w-full justify-center items-center border-t border-neutral-200 dark:border-neutral-900">
                            <div className="cursor-pointer pt-1 pb-1">
                                <GripHorizontal size={20} />
                            </div>
                            <div className="relative w-full h-80 overflow-hidden border-t border-b border-neutral-950 dark:border-neutral-900">
                                <div className="absolute w-full h-full top-0 left-0 bg-cover bg-center" style={{ backgroundImage: `url('${block.url}')` }}>
                                    <div className="flex justify-center items-end absolute bottom-0 left-0 right-0 inset-0 bg-gradient-to-b from-transparent to-neutral-900">
                                        <p className="pb-[15px] text-white text-base font-bold shadow-[0_0px_10px_rgba(0, 0, 0, 0.13)]">{block.label}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }

                if (block.type === "IconLink") {
                    return (
                        <a key={index} href={block.href}>
                            <div className="relative flex items-center py-4 px-2.5 w-full border-t border-b border-neutral-950 dark:border-neutral-900">
                                <div className="absolute left-2.5 w-11 h-11 flex items-center justify-center rounded-2xl border border-neutral-950 dark:border-neutral-800">
                                    <DynamicIcon iconName={block.icon} size={18} />
                                </div>
                                <div className="w-full text-lg font-bold text-center">
                                    {block.title}
                                </div>
                            </div>
                        </a>
                    )
                }

                if (block.type === "Text") {
                    return (
                        <div key={index} className="w-full flex justify-center items-center text-neutral-800 dark:text-neutral-300 text-lg font-bold mt-3 mb-[-10px] border-t border-b border-neutral-950 dark:border-neutral-900">
                            {block.text}
                        </div>
                    )
                }

                return null
            })}
        </>
    )
}