"use client"

import { useEffect, useState } from "react"
import Image from 'next/image'
import { useUser } from "@/hooks/useUser"
import { useTheme } from "@/hooks/useTheme"
import { EllipsisVertical, Flag, MapPin, BriefcaseBusiness, Calendar, Mail, FlaskConical } from "lucide-react";
import { SiGoogle } from "@icons-pack/react-simple-icons";

export default async function Profile({ username }: { username: string }) {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const getUser = async () => {
            const response = await fetch("/api/user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username: username }),
            });

            if (!response.ok) {
                console.error("An Unexpected Error has occurred:", await response.text());

                return;
            }

            const userData = await response.json();
            setUser(userData.data);
        }

        getUser();
    }, []);

    return (
        <div className="bg-fixed bg-cover bg-center min-h-screen w-full" style={{ backgroundColor: "#000", backgroundImage: "url('')" }}>
            <div className="text-center max-w-[600px] w-[90%] mx-auto pt-[60px]">
                <div className="relative w-full h-auto">
                    <div className="relative w-full h-auto rounded-3xl overflow-hidden">
                        <Image
                            src={user?.cover}
                            className="w-full h-70 object-cover"
                            width={600}
                            height={300}
                            alt="User cover"
                        />
                        {/*
                                                        <video className='w-full h-60 object-cover' autoPlay muted loop>
                                <source src="https://storage.evex.land/download?key=uCfQeIxQHweJalawIgtN%2Fisj8k1Nua4b1zB4PIeCLpPJEaBKCsI2lM%2FShVGpkdMvGjlXULGDD5f6yQ8%2BEl3gR4M%2BrgqKBY7HXDmU7p9929A%3D" type='video/mp4' />
                            </video>
                            */}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-neutral-950 opacity-60"></div>
                    </div>
                    <div className='absolute left-[20px] bottom-[-50px] w-[110px] h-[110px] border-[5px] border-transparent'>
                        <Image src={user?.avatar} className='w-full h-full object-cover rounded-full' width={500} height={500} alt='User Icon' />
                    </div>
                </div>

                <div className="mt-4.5 flex justify-end pr-2">
                    <button className="p-2.5 rounded-full border border-neutral-300 dark:border-neutral-900 text-white text-sm">
                        <EllipsisVertical size={16} />
                    </button>
                </div>

                <div className="text-neutral-950 dark:text-neutral-50 text-left mt-[8px] pb-5 pl-5 pr-5">
                    <h1 className="text-3xl font-bold inline-flex items-center">{user?.name}</h1>
                    <p className="text-lg mt-1 whitespace-pre-line">{user?.bio.introduction}</p>
                    <div className="flex flex-row flex-wrap mt-1 text-neutral-800 dark:text-neutral-400 text-base gap-x-3 gap-y-1">
                        <p className="flex items-center"><MapPin size={16} className="mr-1" />{user?.bio.location}</p>
                        <p className="flex items-center"><BriefcaseBusiness size={16} className="mr-1" />{user?.bio.occupation}</p>
                        <p className="flex items-center"><Mail size={16} className="mr-1" />{user?.bio.contact}</p>
                        <p className="flex items-center"><FlaskConical size={16} className="mr-1" />Canary</p>
                        <p className="flex items-center"><Calendar size={16} className="mr-1" />Joined {user?.createdAt}</p>
                    </div>
                </div>

                <div className="flex flex-col mt-3 gap-y-5">
                    {/* Image Object */}
                    <a>
                        <div className="relative w-full h-80 overflow-hidden rounded-3xl">
                            <div className="absolute w-full h-full top-0 left-0 bg-cover bg-center" style={{ backgroundImage: "url('https://wallpapers.com/images/hd/dark-theme-background-z65tfo4y87nhrxzf.jpg')" }}>
                                <div className="flex justify-center items-end absolute bottom-0 left-0 right-0 inset-0 bg-gradient-to-b from-transparent to-neutral-900">
                                    <p className="pb-[15px] text-white text-base font-bold shadow-[0_0px_10px_rgba(0, 0, 0, 0.13)]">Github</p>
                                </div>
                            </div>
                        </div>
                    </a>

                    {/* Link Object */}
                    <a>
                        <div className="relative flex items-center decoration-auto background-transparent border border-neutral-950 dark:border-neutral-800 rounded-3xl py-4 px-2.5 w-full">
                            <div className="absolute left-2.5 w-11 h-11 flex items-center justify-center rounded-2xl border border-neutral-950 dark:border-neutral-800">
                                <SiGoogle size={18} />
                            </div>
                            <div className="w-full text-lg font-bold text-center">
                                Google
                            </div>
                        </div>
                    </a>

                    {/* Title */}
                    <div className="w-full flex justify-center items-center text-neutral-800 dark:text-neutral-300 text-lg font-bold mt-3 mb-[-10px]">
                        Contact me ;)
                    </div>
                </div>

                <div className="flex justify-center mt-auto">
                    <a className="flex text-black/55 dark:text-white/55 text-center items-center mt-[30px] p-10">
                        <Flag size={16} className="mr-1" /> Report Bakey
                    </a>
                </div>
            </div>
        </div>
    )
}