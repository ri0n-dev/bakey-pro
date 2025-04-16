import Header from "@/components/layout/login/header";
import Input from "@/components/clinet/welcome/Input";

export const metadata = {
    title: 'Welcome',
    description: 'Bakey is a service designed to connect people. Create your own personalized profile page and share it.',
}

export default function welcomePage() {
    return (
        <>
            <Header />

            <div className="flex flex-col justify-center items-center gap-3 w-full max-w-sm mx-auto h-[85vh]">
                <h1 className="text-neutral-950 dark:text-neutral-50 bg-clip-text text-5xl">Set Username</h1>
                <p className="text-neutral-600 dark:text-neutral-400 text-base text-center mb-7.5">Let's set your username. The username will be used to the URL of your profile page.</p>

                <p className="text-neutral-500 text-sm text-center mt-6">Your username will be visible to everyone. You will need to wait 30 days before making another change.</p>
            </div>
        </>
    )
}