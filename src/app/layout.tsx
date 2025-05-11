import { ThemeProvider } from "@/providers/ThemeProvider";
import { NextIntlClientProvider } from 'next-intl';
import { getLocale } from 'next-intl/server';
import { GeistSans } from 'geist/font/sans'
import { Toaster } from "@/components/ui/Sonner";
import "@/styles/Tailwind.css";

export const metadata = {
  title: {
    default: 'Bakey',
    template: '%s / Bakey'
  },
  description: 'I am a student working as an engineer, doing web development and app development.',
  metadataBase: new URL('https://bakey.pro'),
  openGraph: {
    title: 'Express yourself in one link',
    description: "Bakey will combine multiple Links that you own int one Link. You can easily create and share stylish designs. Why don't you join us?",
    url: 'https://bakey.pro',
    siteName: 'Bakey',
    images: [
      {
        url: '/ogp.webp',
        width: 1200,
        height: 630,
      }
    ],
    locale: 'ja_JP',
    type: 'website',
  },
  icons: {
    icon: '/favicon.png',
  },
  robots: {
    index: true,
    follow: true,
  },
  publisher: '@bakey_pro',
  creator: '@bakey_pro',
  keywords: ['Bakey', 'bakey', 'Bakey Pro'],
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();

  return (
    <html lang={locale} className={GeistSans.className} suppressHydrationWarning>
      <head>
        <style>{`
          img {
            -webkit-user-drag: none;
            -khtml-user-drag: none;
            -moz-user-drag: none;
            -o-user-drag: none;
            user-drag: none;
            -webkit-user-select: none;
            -khtml-user-select: none;
            -moz-user-select: none;
            -o-user-select: none;
            user-select: none;
          }
        `}</style>
      </head>
      <body className="h-full overflow-y-scroll scrollbar-none bg-neutral-50 dark:bg-neutral-950 text-black dark:text-white font-geist">
        <ThemeProvider attribute="class">
          <NextIntlClientProvider>
            {children}
            <Toaster />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
