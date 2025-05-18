"use client"

import { useState } from "react"
import { Icon } from "@iconify/react";
import DynamicIcon from "@/libs/DynamicIcon"
import ThumbnailDialog from "@/components/ui/Thumbnail"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/DropdownMenu"
import { Button as UIButton } from "@/components/ui/Button"
import { Label } from "@/components/ui/Label"
import { Input } from "@/components/ui/Input"
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/AlertDialog"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/Dialog"
import { EllipsisVertical, Ellipsis, Pen, Sparkles, Trash, Lock } from "lucide-react"

type Block = {
    id: string
    content: any[]
    component?: string
    lock: string
    redirect?: string
    title?: string
    icon?: string
}

export const Button: React.FC<{ title: string; redirect: string; icon: React.ReactNode; }> = ({ title, redirect, icon }) => {
    return (
        <a href={redirect} target="_blank" rel="noopener noreferrer">
            <div className="relative flex items-center py-4 px-2.5 w-full border-t border-b border-neutral-950 dark:border-neutral-900">
                <div className="absolute left-2.5 w-11 h-11 flex items-center justify-center rounded-2xl border border-neutral-950 dark:border-neutral-800">
                    {typeof icon === "string" && icon.startsWith("/api/") ? (
                        <img src={icon} alt={title} className="w-full h-full rounded-xl object-contain" />
                    ) : (
                        <DynamicIcon iconName={String(icon) || ""} size={20} />
                    )}
                </div>
                <div className="w-full text-lg font-bold text-center">
                    {title}
                </div>
            </div>
        </a>
    )
}

export const ButtonAdmin: React.FC<{ content: any[]; redirect: string; id: string; handleSave: (id: string, changes: Partial<Block>) => void; handleDelete: (id: string) => void; }> = ({ content, redirect, id, handleSave, handleDelete }) => {
    const [current, setCurrent] = useState(content[0] ? { ...content[0], redirect: redirect ?? "" } : { title: "", icon: "", redirect: "" });
    const [openEditDialog, setOpenEditDialog] = useState(false)
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
    const [editContent, setEditContent] = useState<any>(current);
    const [openIconPickerDialog, setOpenIconPickerDialog] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    const onOpenEdit = () => {setEditContent(current); setTimeout(() => setOpenEditDialog(true), 10);};
    const isChanged = JSON.stringify({ ...editContent, redirect: editContent.redirect ?? "" }) !== JSON.stringify({ ...current, redirect: current.redirect ?? "" });

    const onSave = () => {
        setIsSaving(true);
        handleSave(id, { content: [{ ...editContent }], redirect: editContent.redirect });
        setCurrent({ ...editContent });
        setIsSaving(false);
        setOpenEditDialog(false);
    }

    const onDelete = () => {
        handleDelete(id);
        setOpenDeleteDialog(false);
    }

    return (
        <div className="relative flex items-center py-4 px-2.5 w-full border-t border-b border-neutral-950 dark:border-neutral-900">
            <div className="absolute left-2.5 w-11 h-11 flex items-center justify-center rounded-2xl border border-neutral-950 dark:border-neutral-800">
                {typeof current.icon === "string" && current.icon.startsWith("/api/") ? (
                    <img src={current.icon} alt={current.title} className="w-full h-full rounded-xl object-contain" />
                ) : (
                    <Icon icon={String(current.icon ?? "")} className="w-5 h-5 text-gray-900 dark:text-white" />
                )}
            </div>
            <div className="w-full text-lg font-bold text-center">
                {current.title}
            </div>
            <div className="absolute right-2.5 w-11 h-11 flex items-center justify-center">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <UIButton className="rounded-2xl" variant="ghost" size="icon"><EllipsisVertical /></UIButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="min-w-40">
                        <DropdownMenuItem onSelect={(e) => { e.preventDefault(); onOpenEdit(); }}><Pen />Edit</DropdownMenuItem>
                        <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
                            <DialogContent className="sm:max-w-[450px]">
                                <DialogHeader>
                                    <DialogTitle>Edit Block</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-3">
                                    <div className="flex justify-center items-center mb-2 w-full h-[100px] bg-[#fff] dark:bg-[#121212] bg-[linear-gradient(#00000009_1px,transparent_1px),linear-gradient(90deg,#00000009_1px,transparent_1px)] dark:bg-[linear-gradient(#ffffff09_1px,transparent_1px),linear-gradient(90deg,#ffffff09_1px,transparent_1px)] bg-[length:10px_10px] bg-center border border-neutral-200 dark:border-neutral-800 rounded-md">
                                        {typeof editContent.icon === "string" && editContent.icon.startsWith("/api/") ? (
                                            <img width={100} height={100} src={editContent.icon} alt="icon" className="w-12 h-12 object-contain" />
                                        ) : (
                                            <Icon icon={String(editContent.icon || "")} className="w-12 h-12 text-gray-900 dark:text-white" />
                                        )}
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="name" className="text-right">Icon</Label>
                                        <div className="flex col-span-3">
                                            <Input className="mr-2.5" value={String(editContent.icon || '')} onChange={(e) => setEditContent({ ...editContent, icon: e.target.value })} type="text" id="location" maxLength={30} />
                                            <UIButton onClick={() => setOpenIconPickerDialog(true)} variant="outline" size="icon"><Ellipsis /></UIButton>
                                            <ThumbnailDialog open={openIconPickerDialog} onOpenChange={setOpenIconPickerDialog} onSelect={(e) => setEditContent({ ...editContent, icon: e })} id={editContent?.id || ""} />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="name" className="text-right">Name</Label>
                                        <Input value={editContent.title || ''} onChange={(e) => setEditContent({ ...editContent, title: e.target.value })} type="text" id="location" className="col-span-3" minLength={1} maxLength={30} />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="name" className="text-right">Redirect</Label>
                                        <Input value={editContent.redirect || ''} onChange={(e) => setEditContent({ ...editContent, redirect: e.target.value })} type="text" id="location" className="col-span-3" maxLength={30} />
                                    </div>
                                </div>
                                <DialogFooter className="flex gap-x-1">
                                    <DialogClose asChild>
                                        <UIButton className="cursor-pointer" variant="ghost">Cancel</UIButton>
                                    </DialogClose>
                                    <UIButton onClick={onSave} disabled={isSaving || !(typeof editContent?.title === "string" && editContent?.title.trim()) || !(typeof editContent?.icon === "string" && editContent?.icon.trim()) || !isChanged} className="cursor-pointer" type="submit">Save</UIButton>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                        <DropdownMenuItem><Sparkles />Animation</DropdownMenuItem>
                        <DropdownMenuItem><Lock />Security</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setTimeout(() => setOpenDeleteDialog(true), 10) }} className="text-red-950 dark:text-red-200 hover:text-red-950 hover:dark:text-red-200"><Trash className="text-red-300 dark:text-red-200" />Delete</DropdownMenuItem>
                        <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Would you like to delete it?</AlertDialogTitle>
                                    <AlertDialogDescription>Are you sure you want to delete this block? This action cannot be undone.</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <UIButton onClick={() => setOpenDeleteDialog(false)} className="cursor-pointer" variant="ghost">Cancel</UIButton>
                                    <UIButton onClick={onDelete} variant="destructive">Delete</UIButton>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}