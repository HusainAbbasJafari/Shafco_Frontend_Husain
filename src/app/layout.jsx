import '@/app/globals.css';
import ClientLayout from '@/components/ClientLayout';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import "nprogress/nprogress.css"; // Import styles
import { Providers } from './providers';

export const metadata = {
  title: "Shafco",
  description: "About shafco",
};

export default async function RootLayout({ children }) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <Providers>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <ClientLayout>
                {children}
            </ClientLayout>
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
}

