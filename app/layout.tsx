import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import AuthSessionProvider from '@/components/SessionProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TradeCraft',
  description: 'TradeCraft: Institutional-grade trade plans, technical and fundamental analysis for all traders.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7507424386197703"
          crossOrigin="anonymous"
        ></script>
        {/* Google Analytics tag */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-79EFCZT0E0"></script>
        <script dangerouslySetInnerHTML={{__html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-79EFCZT0E0');
        `}} />
      </head>
      <body className={`${inter.className} vsc-initialized`} suppressHydrationWarning>
        <AuthSessionProvider>
          <Header />
          {children}
          <Footer />
        </AuthSessionProvider>
      </body>
    </html>
  );
}
