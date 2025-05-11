"use client";

import { useState, useEffect, useRef } from "react";
import Cropper from "cropperjs";
import { Icon } from "@iconify/react";
import { supabase } from "@/libs/SupabaseClient";
import simpleIcons from "@/libs/Simple-icons.json";
import { Button } from "@/components/ui/Button"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input"
import { ChevronRight } from "lucide-react";
import "cropperjs/dist/cropper.css";

function CalculateSimilarityScore(a: string, b: string): number {
    if (a === b) return 1;
    const minLength = Math.min(a.length, b.length);
    const commonPrefixLength = Array.from({ length: minLength }).findIndex((_, i) => a[i] !== b[i]);
    return commonPrefixLength === -1 ? minLength / Math.max(a.length, b.length) : commonPrefixLength / Math.max(a.length, b.length);
}

export default function IconPickerDialog({ open, onOpenChange, onSelect, id }: { open: boolean; onOpenChange: (open: boolean) => void; onSelect: (icon: string) => void; id: string }) {
    const [mode, setMode] = useState<"Select" | "SimpleIcons" | "Upload">("Select");
    const [searchTerm, setSearchTerm] = useState("");
    const icons = Object.keys((simpleIcons as any).icons);
    const imageRef = useRef<HTMLImageElement | null>(null);
    const cropperRef = useRef<Cropper | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (open) {
            setMode("Select");
            setSearchTerm("");
            setPreviewUrl("");
        }
    }, [open]);

    useEffect(() => {
        if (previewUrl && imageRef.current) {
            if (cropperRef.current) {
                cropperRef.current.destroy();
            }

            try {
                cropperRef.current = new Cropper(imageRef.current, {
                    aspectRatio: 50 / 50,
                    viewMode: 1,
                    autoCropArea: 1,
                    responsive: true,
                    guides: false,
                    dragMode: "move",
                });
            } catch (error) {
                console.error("Error initializing Cropper:", error);
                toast.error("Failed to initialize the image cropper. Please try again.")
            }
        }
    }, [previewUrl]);

    const filteredIcons = icons
        .map((icon) => ({
            name: icon,
            score: CalculateSimilarityScore(searchTerm.toLowerCase(), icon.toLowerCase()),
        }))
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score)
        .map(({ name }) => name);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith("image/") || file.type === "image/gif") {
                toast.error("Please upload a valid image (excluding GIFs).")
                setPreviewUrl("");
                return;
            }

            if (file.size > 3 * 1024 * 1024) {
                toast.error("File is too large. Please upload an image smaller than 3MB.")
                setPreviewUrl("");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const img = document.createElement('img');
                img.src = reader.result as string;
                img.onload = () => {
                    if (img.width < 1 || img.height < 1) {
                        toast.error("Please upload a valid image. Please try another file.")
                        return;
                    }
                    setPreviewUrl(reader.result as string);
                };
                img.onerror = () => {
                    toast.error("Failed to load the image. Please try another file.")
                };
            };
            reader.readAsDataURL(file);
        }
    };

    const onDrop = async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer?.files?.[0];
        if (file) {
            if (!file.type.startsWith("image/") || file.type === "image/gif") {
                toast.error("Failed to convert image. Please try again.");
                return;
            }

            if (file.size > 3 * 1024 * 1024) {
                toast.error("File is too large. Please upload an image smaller than 3MB.")
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const img = document.createElement("img");
                img.src = reader.result as string;
                img.onload = () => {
                    if (img.width < 1 || img.height < 1) {
                        toast.error("Please upload a valid image. Please try another file.")
                        return;
                    }
                    setPreviewUrl(reader.result as string);
                };
                img.onerror = () => {
                    toast.error("Failed to load the image. Please try another file.")
                };
            };
            reader.readAsDataURL(file);
        }
    }

    const handleSave = async () => {
        if (!cropperRef.current) {
            toast.error("Failed to initialize the image cropper. Please try again.");
            return;
        }

        setIsSaving(true);
        toast("Uploading...");

        try {
            const canvas = cropperRef.current.getCroppedCanvas({ width: 500, height: 500 });
            if (!canvas) {
                toast.error("Failed to crop the image. Please try again.");
                return;
            }

            const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
            if (!blob) {
                toast.error("Failed to convert image. Please try again.");
                return;
            }

            const base64 = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    if (typeof reader.result === "string") {
                        const base64Data = reader.result.split(",")[1];
                        resolve(base64Data)
                    } else {
                        reject("Failed to read image as base64.")
                    }
                };
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            })

            const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
            if (sessionError || !sessionData.session) {
                toast.error("An error has occurred. Please try again later.");
                console.error("Unexpected error getting Session:", sessionError);
                setIsSaving(false);
                return;
            }

            const response = await fetch("/api/settings/block/thumbnail/", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${sessionData.session.access_token}`,
                },
                body: JSON.stringify({
                    file: base64,
                    blockId: id,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                const thumbnailUrl = data.url;

                onSelect(thumbnailUrl);
                onOpenChange(false);
                toast.success("Upload Successful");
            } else {
                toast.error("An unexpected error occurred. Please try again.");
            }
        } catch (error) {
            toast.error("Failed to upload. Please try again.");
            console.error("Error during upload:", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[460px]">
                    {mode === "Select" && (
                        <>
                            <DialogHeader>
                                <DialogTitle>Add Thumbnail</DialogTitle>
                                <DialogDescription>Please select the icon you want to use or upload it.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-2">
                                <a onClick={() => setMode("SimpleIcons")} className="flex items-center justify-between px-5 py-3.5 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-100 dark:bg-neutral-900 cursor-pointer transition-all duration-300 text-gray-900 dark:text-white w-full hover:border-[#e4e4e4] dark:hover:border-[#2b2b2b]">
                                    <div className="flex items-center justify-center">
                                        <Icon icon="simple-icons:simpleicons" className="w-6 h-6 pr-2" />
                                        <p className="text-base">Simple Icons</p>
                                    </div>
                                    <ChevronRight className="w-4 h-4" />
                                </a>
                                <a onClick={() => setMode("Upload")} className="flex items-center justify-between px-5 py-3.5 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-100 dark:bg-neutral-900 cursor-pointer transition-all duration-300 text-gray-900 dark:text-white w-full hover:border-[#e4e4e4] dark:hover:border-[#2b2b2b]">
                                    <div className="flex items-center justify-center">
                                        <Icon icon="lucide:image" className="w-6 h-6 pr-2" />
                                        <p className="text-base">Upload Image</p>
                                    </div>
                                    <ChevronRight className="w-4 h-4" />
                                </a>
                            </div>
                        </>
                    )}

                    {mode === "SimpleIcons" && (
                        <>
                            <DialogHeader>
                                <DialogTitle>Add Thumbnail</DialogTitle>
                                <DialogDescription>Find the brand icon you want to use</DialogDescription>
                            </DialogHeader>

                            <div className="relative w-full">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><Icon icon="lucide:search" className="w-4 h-4" /></span>
                                <Input className="w-full pl-9" onChange={(e) => setSearchTerm(e.target.value)} value={searchTerm} type="text" placeholder="Search icons..." />
                            </div>

                            <div className="grid grid-cols-6 gap-4 max-h-[300px] overflow-y-scroll">
                                {filteredIcons.map((iconName) => (
                                    <button key={iconName} onClick={() => { onSelect("simple-icons:" + iconName); onOpenChange(false); }} className="flex items-center justify-center w-13 h-13 p-2 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-100 dark:bg-neutral-900 cursor-pointer transition-all duration-300 hover:border-[#e4e4e4] dark:hover:border-[#2b2b2b]">
                                        <Icon icon={`simple-icons:${iconName}`} className="w-5 h-5 text-gray-900 dark:text-white" />
                                    </button>
                                ))}
                            </div>
                            <p className="text-center text-sm text-neutral-500 dark:text-neutral-700">Icons by <a href="https://simpleicons.org/" target="_blank" className="underline">Simple Icons</a> & <a href="https://github.com/iconify/icon-sets/blob/master/json/simple-icons.json" target="_blank" className="underline">Iconify</a></p>
                        </>
                    )}

                    {mode === "Upload" && (
                        <>
                            <DialogHeader>
                                <DialogTitle>Add Thumbnail</DialogTitle>
                                <DialogDescription>Upload the image you want to use</DialogDescription>
                            </DialogHeader>

                            {!previewUrl && (
                                <div onClick={() => document.getElementById("fileInput")?.click()} onDragOver={(e) => e.preventDefault()} onDrop={onDrop} className="flex items-center justify-center cursor-pointer w-full h-40 border border-dashed rounded text-muted-foreground">Click or Drop to upload</div>
                            )}

                            <input id="fileInput" type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />

                            {previewUrl && (
                                <>
                                    <div className="flex w-full justify-center">
                                        <div className="relative w-full h-100 border border-dashed rounded overflow-hidden flex items-center justify-center">
                                            <img ref={imageRef} src={previewUrl} alt="Preview" className="block max-w-full max-h-full object-contain" />
                                        </div>
                                    </div>
                                </>
                            )}

                            <DialogFooter className="flex gap-x-1">
                                <DialogClose asChild>
                                    <Button className="cursor-pointer" variant="ghost">Cancel</Button>
                                </DialogClose>
                                <Button className="cursor-pointer" onClick={handleSave} disabled={isSaving} type="submit">Save</Button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}