import Image from "next/image";
import AuthCallbackHandler from "@/components/clinet/auth/AuthCallbackHandler";

export const metadata = {
  title: 'Authenticating...',
  description: 'Bakey is a service designed to connect people. Create your own personalized profile page and share it.',
}

export default function AuthCallback() {
  return (
    <>
      <AuthCallbackHandler />
      <div className="flex flex-col min-h-screen justify-center items-center">
        <div className="text-center max-w-150 w-full">
          <Image src={"/assets/bakey.svg"} className="object-contain mx-auto pb-5" width={80} height={80} alt="Bakey" />
          <h1 className="text-5xl text-neutral-950 dark:text-neutral-50 pb-3">Authenticating</h1>
          <p className="text-lg text-neutral-950 dark:text-neutral-50">Please wait a moment...</p>
        </div>
      </div>
    </>
  );
}