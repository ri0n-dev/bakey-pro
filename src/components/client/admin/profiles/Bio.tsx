"use client";

import { useUser } from "@/hooks/useUser";
import { useState, useEffect } from "react";
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/Skeleton"
import { Button } from "@/components/ui/Button"
import { Label } from "@/components/ui/Label"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/Dialog"
import { MapPin, BriefcaseBusiness, Calendar, Mail, FlaskConical } from "lucide-react";

export default function IconEdit() {
    const { user } = useUser();
    const [isBioOpen, setIsBioOpen] = useState(false);
    const [isOtherOpen, setIsOtherOpen] = useState(false);
    const [currentName, setCurrentName] = useState("");
    const [currentIntroduction, setCurrentIntroduction] = useState("");
    const [currentLocation, setCurrentLocation] = useState("");
    const [currentOccupation, setCurrentOccupation] = useState("");
    const [currentContact, setCurrentContact] = useState("");
    const [currentJoined, setCurrentJoined] = useState("");
    const [originalName, setOriginalName] = useState("");
    const [originalIntroduction, setOriginalIntroduction] = useState("");
    const [originalLocation, setOriginalLocation] = useState("");
    const [originalOccupation, setOriginalOccupation] = useState("");
    const [originalContact, setOriginalContact] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user) {
            setCurrentName(user.name);
            setCurrentLocation(user.bio?.location || "");
            setCurrentOccupation(user.bio?.occupation || "");
            setCurrentIntroduction(user.bio?.introduction || "");
            setCurrentContact(user.bio?.contact || "");
            setCurrentJoined(user.joined_at || "");

            setOriginalName(user.name);
            setOriginalLocation(user.bio?.location || "");
            setOriginalOccupation(user.bio?.occupation || "");
            setOriginalIntroduction(user.bio?.introduction || "");
            setOriginalContact(user.bio?.contact || "");
            setIsLoading(false);
        } else {
            const timer = setTimeout(() => {
                setCurrentName("");
                setCurrentIntroduction("");
                setCurrentLocation("");
                setCurrentOccupation("");
                setCurrentContact("");
                setCurrentJoined("");
                setIsLoading(false);
            }, 10000);

            return () => clearTimeout(timer);
        }
        setIsLoading(false);
    }, [user]);

    useEffect(() => {
        if (!isBioOpen && user) {
            setOriginalName(user.name);
            setOriginalLocation(user.bio?.location || "");
            setOriginalOccupation(user.bio?.occupation || "");
            setOriginalIntroduction(user.bio?.introduction || "");
            setOriginalContact(user.bio?.contact || "");
        }
    }, [isBioOpen, user]);

    const handleSave = async () => {
        setIsSaving(true);
        toast("Updateing...");

        if (originalName.length < 1) {
            toast.error("Name must be at least 1 character.");
            return;
        }

        if (originalName.length > 50) {
            toast.error("The name has many characters.");
            return
        }

        if (originalIntroduction.length > 200) {
            toast.error("The name has many characters.");
            return
        }

        if (originalLocation.length > 30 || originalOccupation.length > 30 || originalContact.length > 50) {
            toast.error("Something has too many characters.");
            return
        }

        try {
            const response = await fetch('/api/settings/profile/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: originalName,
                    introduction: originalIntroduction,
                    location: originalLocation,
                    occupation: originalOccupation,
                    contact: originalContact,
                }),
            });

            if (response.ok) {
                setCurrentName(originalName)
                setCurrentIntroduction(originalIntroduction)
                setCurrentLocation(originalLocation)
                setCurrentOccupation(originalOccupation)
                setCurrentContact(originalContact)
                setIsOtherOpen(false);
                toast.success("Update Successful");
            } else {
                toast.error("An unexpected error occurred. Please try again.");
                return
            }
        } catch (error) {
            toast.error("Failed to update. Please try again.");
            console.error("Error during update:", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <>
            {isLoading ? (
                <>
                    <div style={{ marginBottom: "10px" }}>
                        <Skeleton className="w-[50%] h-[34px] rounded-sm object-cover" />
                    </div>
                    <div style={{ marginBottom: "10px" }}>
                        <Skeleton className="w-[100%] h-[21px] rounded-sm object-cover" />
                        <Skeleton className="w-[60%] h-[21px] mt-1.5 rounded-sm object-cover" />
                    </div>
                </>
            ) : (
                <Dialog open={isBioOpen} onOpenChange={setIsBioOpen}>
                    <DialogTrigger asChild>
                        <div className="hover:underline">
                            <h1 className="text-3xl font-bold cursor-pointer inline-flex items-center">{currentName}</h1>
                            <p className="text-lg mt-1 cursor-pointer whitespace-pre-line">{currentIntroduction}</p>
                        </div>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Edit Profile</DialogTitle>
                            <DialogDescription>
                                Edit your name or bio
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">Name</Label>
                                <Input type="text" id="name" value={originalName} onChange={(e) => setOriginalName(e.target.value)} className="col-span-3" maxLength={50} />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="username" className="text-right">Bio</Label>
                                <Textarea id="username" value={originalIntroduction} onChange={(e) => setOriginalIntroduction(e.target.value)} className="col-span-3 h-25 resize-none" maxLength={200} />
                            </div>
                        </div>

                        <DialogFooter className="flex gap-x-2">
                            <DialogClose asChild>
                                <Button className="cursor-pointer" variant="ghost">Cancel</Button>
                            </DialogClose>
                            <Button className="cursor-pointer" onClick={handleSave} disabled={isSaving || originalName.trim() === "" || originalName === currentName && originalIntroduction === currentIntroduction && originalLocation === currentLocation && originalOccupation === currentOccupation && originalContact === currentContact} type="submit">Save</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

            {isLoading ? (
                <div className="flex flex-row flex-wrap mt-1 text-neutral-800 dark:text-neutral-400 text-base gap-x-3 gap-y-1">
                    <Skeleton className="w-[100%] h-[50px] rounded-sm object-cover" />
                </div >
            ) : (
                <>
                    <Dialog open={isOtherOpen} onOpenChange={setIsOtherOpen}>
                        <DialogTrigger asChild>
                            <div className="flex flex-row flex-wrap mt-1 text-neutral-800 dark:text-neutral-400 text-base gap-x-3 gap-y-1 / cursor-pointer hover:underline">
                                {currentLocation && (
                                    <p className="flex items-center hover:underline"><MapPin size={16} className="mr-1" />{currentLocation}</p>
                                )}
                                {currentOccupation && (
                                    <p className="flex items-center hover:underline"><BriefcaseBusiness size={16} className="mr-1" />{currentOccupation}</p>
                                )}
                                {currentContact && (
                                    <p className="flex items-center hover:underline"><Mail size={16} className="mr-1" />{currentContact}</p>
                                )}
                                <p className="flex items-center hover:underline"><FlaskConical size={16} className="mr-1" />Canary</p>
                                {currentJoined && (
                                    <p className="flex items-center hover:underline"><Calendar size={16} className="mr-1" />Joined {new Date(currentJoined).toLocaleDateString("en-US", { year: "numeric", month: "long" })}</p>
                                )}
                            </div >
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>Edit Profile</DialogTitle>
                                <DialogDescription>
                                    Edit your location, occupation or contact info
                                </DialogDescription>
                            </DialogHeader>

                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name" className="text-right">Location</Label>
                                    <Input type="text" id="location" value={originalLocation} onChange={(e) => setOriginalLocation(e.target.value)} className="col-span-3" maxLength={30} />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name" className="text-right">Occupation</Label>
                                    <Input type="text" id="location" value={originalOccupation} onChange={(e) => setOriginalOccupation(e.target.value)} className="col-span-3" maxLength={30} />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name" className="text-right">Contact Info</Label>
                                    <Input type="text" id="location" value={originalContact} onChange={(e) => setOriginalContact(e.target.value)} className="col-span-3" maxLength={30} />
                                </div>
                            </div>

                            <DialogFooter className="flex gap-x-1">
                                <DialogClose asChild>
                                    <Button className="cursor-pointer" variant="ghost">Cancel</Button>
                                </DialogClose>
                                <Button className="cursor-pointer" onClick={handleSave} disabled={isSaving || originalName === currentName && originalIntroduction === currentIntroduction && originalLocation === currentLocation && originalOccupation === currentOccupation && originalContact === currentContact} type="submit">Save</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </>
            )
            }
        </>
    )
}