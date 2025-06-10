import './globals.css';
import './styles/mantine.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { MantineProvider, createTheme } from '@mantine/core';
import { Providers } from './providers';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ScrollToTopButton from '@/components/ui/ScrollToTopButton';

const inter = Inter({ subsets: ['latin'] });

const theme = createTheme({
  primaryColor: 'blue',
  fontFamily: inter.style.fontFamily,
  components: {
    RichTextEditor: {
      styles: {
        toolbar: {
          borderBottom: '1px solid #e2e8f0',
        },
        content: {
          minHeight: '200px',
        },
      },
    },
  },
});

export const metadata: Metadata = {
  title: 'Interview Q&A Platform',
  description: 'A platform for interview questions and answers',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col bg-gray-50`}>
        <MantineProvider theme={theme}>
          <Providers>
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </Providers>
        </MantineProvider>
        <ScrollToTopButton />
      </body>
    </html>
  );
}