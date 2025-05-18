"use client";

import { useUser } from "@/hooks/useUser"
import { useBlock } from "@/hooks/useBlock"
import { useState, useEffect } from "react";
import { useBlockStore } from "@/stores/useBlock"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { toast } from "sonner"
import { Icon } from "@iconify/react";
import { Dialog, DialogTrigger, DialogDescription, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/Dialog"
import { Plus, Search } from "lucide-react"

export type BlockData = {
    title: string;
    description: string;
    icon: string;
    insert?: any[];
    component: string;
    bg?: string;
    disabled?: boolean;
}


export default function BlockStore() {
    const { blocks, setBlocks } = useBlockStore()
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false);

    const filtered: { genre: string; blocks: BlockData[] }[] = [
        {
            "genre": "Links",
            "blocks": [
                { "title": "Button", "description": "Add a button", "icon": "lucide:link", "insert": [{ "icon": "lucide:link", "title": "Link" }], "component": "Button" },
                { "title": "OGP", "description": "Add OGP support", "icon": "lucide:panel-bottom", "insert": [{ "image": "", "title": "Link" }], "component": "Image" },
                { "title": "Image", "description": "Add your image", "icon": "lucide:image", "insert": [{ "ogp": "" }], "component": "Image" }
            ]
        },
        {
            "genre": "Share your content",
            "blocks": [
                { "title": "X", "description": "Share your posts", "icon": "simple-icons:x", "bg": "#000", "insert": [{ "url": "" }], "component": "X" },
                { "title": "YouTube", "description": "Share your videos", "icon": "simple-icons:youtube", "bg": "#ff0033", "insert": [{ "url": "" }], "component": "YouTube" },
                { "title": "Spotify", "description": "Share music", "icon": "simple-icons:spotify", "bg": "#1db954", "insert": [{ "url": "" }], "component": "Spotify" },
                { "title": "Apple Music", "description": "Share music", "icon": "simple-icons:applemusic", "bg": "linear-gradient(#FF4E6B, #FF0436)", "insert": [{ "url": "" }], "component": "AppleMusic" },
                { "title": "Soundcloud", "description": "Share music", "icon": "simple-icons:soundcloud", "bg": "linear-gradient(120deg, #ff8800, #ff3300)", "insert": [{ "url": "" }], "component": "Soundcloud" },
                { "title": "Text", "description": "Add text", "icon": "lucide:type", "insert": [{ "text": "", "align": "left", "type": "direct" }], "component": "X" },
                { "title": "Video", "description": "Add video", "icon": "lucide:video", "insert": [{ "url": "" }], "component": "Video" },
                { "title": "Photo", "description": "Add photo", "icon": "lucide:camera", "insert": [{ "urls": "", "type": "Single" }], "component": "Photo" },
                { "title": "Map", "description": "Add map", "icon": "lucide:map-pin", "insert": [{ "address": "", "title": "Map" }], "component": "Map" }
            ]
        },
        {
            "genre": "Level up your socials",
            "blocks": [
                { "title": "Discord", "description": "Share your server", "icon": "simple-icons:discord", "bg": "#5865f2", "insert": [{ "api": "", "title": "Discord" }], "component": "Discord" },
                { "title": "Instagram", "description": "Share your posts", "icon": "simple-icons:instagram", "bg": "radial-gradient(circle farthest-corner at 35% 90%, #fec564, transparent 50%), radial-gradient(circle farthest-corner at 0 140%, #fec564, transparent 50%), radial-gradient(ellipse farthest-corner at 0 -25%, #5258cf, transparent 50%), radial-gradient(ellipse farthest-corner at 20% -50%, #5258cf, transparent 50%), radial-gradient(ellipse farthest-corner at 100% 0, #893dc2, transparent 50%), radial-gradient(ellipse farthest-corner at 60% -20%, #893dc2, transparent 50%), radial-gradient(ellipse farthest-corner at 100% 100%, #d9317a, transparent), linear-gradient(#6559ca, #bc318f 30%, #e33f5f 50%, #f77638 70%, #fec66d 100%)", "insert": [], "component": "Instagram", "disabled": true },
                { "title": "Tiktok", "description": "Share your videos", "icon": "simple-icons:tiktok", "bg": "#000", "insert": [], "component": "Tiktok", "disabled": true }
            ]
        }
    ]
        .map((category) => ({
            ...category,
            blocks: category.blocks.filter(
                (block) =>
                    block.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    block.description.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }))
        .filter((category) => category.blocks.length > 0);

    const handleSave = async (newBlock: BlockData) => {
        toast("Saving...")
        setIsLoading(true);

        const id = String(
            Math.max(0, ...blocks.map(b => parseInt(b.id || "0", 10))) + 1
        )

        const newItem = {
            id: id,
            lock: "",
            content: newBlock.insert || [],
            redirect: "",
            component: newBlock.component,
        }

        const updatedBlocks = [newItem, ...blocks]

        try {
            const response = await fetch("/api/settings/block/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ blocks: updatedBlocks }),
            })

            if (response.ok) {
                setBlocks(updatedBlocks)
                toast.success("Added successfully.")
                setOpen(false)
            } else {
                toast.error("Failed to add block.")
            }
        } catch (error) {
            console.error("Error adding block:", error)
            toast.error("Unexpected error occurred.")
        }

        setIsLoading(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" className="rounded-2xl w-35"><Plus /> Add Block</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[750px]">
                <DialogHeader>
                    <DialogTitle>Add Block</DialogTitle>
                    <DialogDescription>
                        Select the block you want to add
                    </DialogDescription>

                    <div className="mt-1 relative w-full">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><Search className="w-4 h-4" /></span>
                        <Input className="w-full pl-9" type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search icons..." />
                    </div>
                </DialogHeader>

                <div className="container mx-auto py-3 max-h-[500px] overflow-y-auto">
                    {filtered.map((category, index) => (
                        <div key={index} className="mb-8">
                            <h2 className="text-xl font-medium mb-4 text-[var(--text-color)]">{category.genre}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 gap-y-5">
                                {category.blocks.map((block, idx) => (
                                    <div key={idx} className="rounded-xl border border-neutral-100 dark:border-neutral-900 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col">
                                        <div className="p-4 flex-grow m-0">
                                            <div className="flex items-start gap-4">
                                                <div className="flex-shrink-0 w-10 h-10">
                                                    <span style={{ background: block.bg || "transparent" }} className={`rounded-lg flex items-center justify-center w-full h-full ${block.bg ? "" : "border border-dashed border-neutral-100 dark:border-neutral-900"}`}>
                                                        <Icon icon={`${block.icon}`} className="w-4.5 h-4.5" />
                                                    </span>
                                                </div>
                                                <div className="flex-grow min-w-0">
                                                    <h3 className="text-base font-medium text-neutral-900 dark:text-neutral-100">
                                                        {block.title}
                                                    </h3>
                                                    <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2 break-words whitespace-pre-line">
                                                        {block.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="px-5 py-3 border-t border-neutral-100 dark:border-neutral-900 flex justify-end">
                                            <Button onClick={() => handleSave(block)} variant="outline" size="sm" className="text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-700" disabled={block.disabled || isLoading}>Add</Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    )
}