import { Button } from "@/components/ui/Button";
import Breadcrumb from "@/components/layout/admin/Breadcrumb";
import { WandSparkles, Eye } from "lucide-react";

export const metadata = {
    title: 'Profile',
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

            <div className="flex flex-grow justify-center items-start mb-5">
                <div className="pb-25">

                </div>
            </div>
        </>
    );
};
