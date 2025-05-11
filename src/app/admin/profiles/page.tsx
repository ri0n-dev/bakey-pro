import Image from "next/image";
import { Button } from "@/components/ui/Button";
import Breadcrumb from "@/components/layout/admin/Breadcrumb";
import Header from "@/components/clinet/admin/profiles/Header"
import Icon from "@/components/clinet/admin/profiles/Icon"
import Bio from "@/components/clinet/admin/profiles/Bio"
import Block from "@/components/clinet/admin/profiles/Block"
import { SiGoogle } from "@icons-pack/react-simple-icons";
import { WandSparkles, Eye } from "lucide-react";

export const metadata = {
    title: 'Profiles',
    description: '',
}

export default function adminProfiles() {
    return (
        <>
            <Breadcrumb>
                <Button size="sm">
                    <WandSparkles />Design
                </Button>
                <Button size="sm">
                    <Eye />Preview
                </Button>
            </Breadcrumb>

            <div className="flex flex-grow justify-center items-start">
                <div className="text-center max-w-[600px] w-[100%] mx-auto pt-[60px] / min-h-full border-l border-r border-neutral-200 dark:border-neutral-900 pb-30">
                    <div className="relative w-full h-auto / pt-3">
                        <Header />
                        <Icon />
                    </div>

                    <div className="text-neutral-950 dark:text-neutral-50 text-left pb-5 pl-5 pr-5 / mt-[60px]">
                        <Bio />
                    </div>

                    <div className="flex flex-col mt-3 gap-y-5">
                        <Block />
                    </div>
                </div>
            </div>
        </>
    );
};
