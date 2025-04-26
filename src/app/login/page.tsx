import { getTranslations } from 'next-intl/server';
import SSO from "@/components/clinet/login/SSO"
import CheckSession from "@/components/clinet/login/CheckSession";
import { Header } from "@/components/layout/login/Header";

export const metadata = {
    title: 'Login',
    description: 'Bakey is a service designed to connect people. Create your own personalized profile page and share it.',
}

export default async function LoginPage() {
    const t = await getTranslations('login');
    const w = await getTranslations('word');

    return (
        <>
            <CheckSession>
                <Header />

                <div className="flex flex-col justify-center items-center gap-3 w-full max-w-sm mx-auto h-[85vh]">
                    <h1 className="text-neutral-950 dark:text-neutral-50 bg-clip-text text-5xl">{t('title')}</h1>
                    <p className="text-neutral-600 dark:text-neutral-400 text-base text-center mb-7.5">{t('description')}</p>

                    <SSO />

                    <p className="text-neutral-500 text-sm text-center mt-6">{t('terms1')} <a className="underline" href="/terms/">{w('terms')}</a> {t('terms2')} <a className="underline" href="/privacy/">{w('privacy')}</a>{t('terms3')}</p>
                </div>
            </CheckSession>
        </>
    );
}