"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { useUserStore } from "@/stores/useUser";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/DropdownMenu"
import { UserPen, UserSearch, TrendingUp, SlidersHorizontal, MessagesSquare, EllipsisVertical, LogOut, User, Plus, BadgeCheck } from 'lucide-react';
import Bakey from "@/assets/bakey.svg";

export default function Sidebar() {
    const { user, loading } = useUserStore();
    const [isRedirecting, setIsRedirecting] = useState(false);

    useEffect(() => {
        if (loading || isRedirecting) return;

        if (!user) {
            setIsRedirecting(true);
            redirect("/login");
        }

        if (!user?.username) {
            setIsRedirecting(true);
            redirect("/welcome");
        }
    }, [user, isRedirecting]);

    if (loading || isRedirecting) {
        return null;
    }

    return (
        <div className="flex flex-col fixed top-0 left-0 min-w-63 h-full p-3 border-r border-neutral-200 dark:border-neutral-900">
            <nav>
                <div className="justify-left items-left text-left pb-4 pt-2 pl-2">
                    <Image src={Bakey} alt="Logo" width={30} height={30} />
                </div>
                <ul className="list-none p-0">
                    <li className="flex text-left items-center justify-start p-2 h-11 mb-1 rounded-md text-neutral-950 dark:text-neutral-50 hover:bg-neutral-100 hover:dark:bg-neutral-900">
                        <a className="flex items-center gap-3.5" href="/admin/">
                            <UserPen className="w-5 h-5 shrink-0 text-center" />
                            <span className="text-base whitespace-nowrap">Profiles</span>
                        </a>
                    </li>
                    <li className="flex text-left items-center justify-start p-2 h-11 mb-1 rounded-md text-neutral-950 dark:text-neutral-50 hover:bg-neutral-100 hover:dark:bg-neutral-900">
                        <a className="flex items-center gap-3.5" href="/admin/">
                            <UserSearch className="w-5 h-5 shrink-0 text-center" />
                            <span className="text-base whitespace-nowrap">Search</span>
                        </a>
                    </li>
                    <li className="flex text-left items-center justify-start p-2 h-11 mb-1 rounded-md text-neutral-950 dark:text-neutral-50 hover:bg-neutral-100 hover:dark:bg-neutral-900">
                        <a className="flex items-center gap-3.5" href="/admin/">
                            <TrendingUp className="w-5 h-5 shrink-0 text-center" />
                            <span className="text-base whitespace-nowrap">Analytics</span>
                        </a>
                    </li>
                    <li className="flex text-left items-center justify-start p-2 h-11 mb-1 rounded-md text-neutral-950 dark:text-neutral-50 hover:bg-neutral-100 hover:dark:bg-neutral-900">
                        <a className="flex items-center gap-3.5" href="/admin/">
                            <SlidersHorizontal className="w-5 h-5 shrink-0 text-center" />
                            <span className="text-base whitespace-nowrap">Settings</span>
                        </a>
                    </li>
                    <li className="flex text-left items-center justify-start p-2 h-11 mb-1 rounded-md text-neutral-950 dark:text-neutral-50 hover:bg-neutral-100 hover:dark:bg-neutral-900">
                        <a className="flex items-center gap-3.5" href="/admin/">
                            <MessagesSquare className="w-5 h-5 shrink-0 text-center" />
                            <span className="text-base whitespace-nowrap">Support</span>
                        </a>
                    </li>
                </ul>
            </nav>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div className="flex justify-between items-center rounded-sm cursor-pointer pt-1 pb-1 mb-1 mt-auto hover:bg-neutral-100 hover:dark:bg-neutral-900">
                        <div className="flex justify-center items-center">
                            <div className="flex items-center justify-center mr-2 w-10 h-10 rounded-full">
                                <Avatar>
                                    <AvatarImage src={user?.avatar} />
                                    <AvatarFallback>WA</AvatarFallback>
                                </Avatar>
                            </div>
                            <div className="flex flex-col">
                                <div className="text-sm relative overflow-hidden whitespace-nowrap overflow-ellipsis">{user?.name}</div>
                                <div className="text-xs relative overflow-hidden whitespace-nowrap overflow-ellipsis">@{user?.username}</div>
                            </div>
                        </div>
                        <div className="flex mr-1 fw-5 h-5 cursor-pointer">
                            <EllipsisVertical className="w-5 h-5" />
                        </div>
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right" sideOffset={8} align="start" className="mb-10 min-w-54">
                    <DropdownMenuLabel className="p-0 font-normal">
                        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                            <Avatar>
                                <AvatarImage src={user?.avatar} />
                                <AvatarFallback>{user?.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">{user?.name}</span>
                                <span className="truncate text-xs">@{user?.username}</span>
                            </div>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem><Plus />Create new Profile</DropdownMenuItem>
                    <DropdownMenuItem><Plus />Create new Organization</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem><User />Account</DropdownMenuItem>
                    <DropdownMenuItem><BadgeCheck />Verified</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem><LogOut />Logout</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}