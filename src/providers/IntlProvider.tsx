import { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';

type IntlProviderProps = {
  children: ReactNode;
  locale: string;
  messages: Record<string, any>;
};

export default function IntlProvider({ children, locale, messages }: IntlProviderProps) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}