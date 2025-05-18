"use client";

import Image from "next/image";
import { useUser } from "@/hooks/useUser";
import { useState, useEffect, useRef } from "react";
import Cropper from "cropperjs";
import { Camera } from "lucide-react";
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/Skeleton"
import { Button } from "@/components/ui/Button"
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/Dialog"
import "cropperjs/dist/cropper.css";

export default function HeaderEdit() {
    const { user } = useUser();
    const imageRef = useRef<HTMLImageElement | null>(null);
    const cropperRef = useRef<Cropper | null>(null);
    const [isHeaderEditOpen, setIsHeaderEditOpen] = useState(false);
    const [currentHeaderUrl, setCurrentHeaderUrl] = useState(user?.header || "/default/header.png");
    const [isDefaultHeader, setIsDefaultHeader] = useState(!user?.header);
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user?.header) {
            setCurrentHeaderUrl(user.header);
            setIsDefaultHeader(false);
            setIsLoading(false);
        } else {
            const timer = setTimeout(() => {
                setCurrentHeaderUrl("/default/header.png");
                setIsDefaultHeader(true);
                setIsLoading(false);
            }, 10000);

            return () => clearTimeout(timer);
        }
        setIsLoading(false);
    }, [user?.header]);

    useEffect(() => {
        if (previewUrl && imageRef.current) {
            if (cropperRef.current) {
                cropperRef.current.destroy();
            }

            try {
                cropperRef.current = new Cropper(imageRef.current, {
                    aspectRatio: 1200 / 600,
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

    useEffect(() => {
        if (!isHeaderEditOpen) {
            setPreviewUrl("");
        }
    }, [isHeaderEditOpen]);

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
            const canvas = cropperRef.current.getCroppedCanvas({ width: 1200, height: 600 });
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

            const response = await fetch("/api/settings/header/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    file: base64
                }),
            });

            if (response.ok) {
                const timestamp = new Date().getTime();
                setCurrentHeaderUrl(`${user?.header}?t=${timestamp}`)
                setIsHeaderEditOpen(false);
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

    const handleImageError = () => {
        if (!isDefaultHeader) {
            setCurrentHeaderUrl("/default/header.png");
            setIsDefaultHeader(true);
            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="relative w-full h-auto overflow-hidden / border-t border-b border-neutral-200 dark:border-neutral-900">
                {isLoading ? (
                    <Skeleton className="w-[100%] h-[300px] rounded-none object-cover" />
                ) : (
                    <>
                        <Image src={currentHeaderUrl} className="w-full h-70 object-cover opacity-50" width={600} height={300} alt="User Header" onLoad={() => setIsLoading(false)} onError={handleImageError} priority unoptimized />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-neutral-950 opacity-60"></div>

                        <div className="absolute inset-0 flex items-center justify-center text-white">
                            <Dialog open={isHeaderEditOpen} onOpenChange={setIsHeaderEditOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="icon" className="bg-neutral-300/80 cursor-pointer w-12 h-12 rounded-full">
                                        <Camera className="text-neutral-950 dark:text-neutral-50" size={25} />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[500px]">
                                    <DialogHeader>
                                        <DialogTitle>Edit Header</DialogTitle>
                                        <DialogDescription>
                                            Upload and update your headers
                                        </DialogDescription>
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
                                </DialogContent>
                            </Dialog>
                        </div>
                    </>
                )}
            </div>
        </>
    )
}