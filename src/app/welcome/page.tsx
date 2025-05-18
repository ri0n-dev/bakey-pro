import { getTranslations } from 'next-intl/server';
import { Header } from "@/components/layout/login/Header";
import CheckUsername from "@/components/client/welcome/CheckUsername";
import { Session } from "@/components/Session";
import Input from "@/components/client/welcome/Input";

export const metadata = {
    title: 'Welcome',
    description: 'Bakey is a service designed to connect people. Create your own personalized profile page and share it.',
}

export default async function welcomePage() {
    await Session();
    const t = await getTranslations('welcome');

    return (
        <>
            <Header />
            <CheckUsername />

            <div className="flex flex-col justify-center items-center text-center gap-3 w-full max-w-sm mx-auto h-[85vh]">
                <h1 className="text-neutral-950 dark:text-neutral-50 bg-clip-text text-5xl">{t('title')}</h1>
                <p className="text-neutral-600 dark:text-neutral-400 text-base mb-7.5">{t('description')}</p>

                <Input />

                <p className="text-neutral-500 text-sm  mt-6">{t('note')}</p>
            </div>

        </>
    );
}