import { SessionCheckReverse } from "@/components/sessionCheck";
import SSO from "@/components/clinet/login/sso"
import Header from "@/components/layout/login/header";

export const metadata = {
    title: 'Login',
    description: 'Bakey is a service designed to connect people. Create your own personalized profile page and share it.',
}

export default async function LoginPage() {
    return (
        <>
            <div>


                <Header />

                <div className="flex flex-col justify-center items-center gap-3 w-full max-w-sm mx-auto h-[85vh]">
                    <h1 className="text-neutral-950 dark:text-neutral-50 bg-clip-text text-5xl">A new step</h1>
                    <p className="text-neutral-600 dark:text-neutral-400 text-base text-center mb-7.5">To login to Bakey, you need to choose one of the following steps.</p>

                    <SSO />

                    <p className="text-neutral-500 text-sm text-center mt-6">By singing up, you agree to out <a className="underline" href="/terms/">Terms of Service</a> and <a  className="underline"  href="/privacy/">Privacy Policy</a>. An email can't be used for login.</p>
                </div>
            </div>
        </>
    );
}