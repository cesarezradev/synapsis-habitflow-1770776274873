'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <html lang="pt-BR">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#0f0a1e" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <title>HabitFlow</title>
      </head>
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen min-h-[100dvh] flex flex-col bg-[#0f0a1e]">
          <main className="flex-1 pb-20 safe-top">
            {children}
          </main>

          {/* Bottom Navigation */}
          <nav className="fixed bottom-0 left-0 right-0 glass-strong safe-bottom z-50">
            <div className="flex items-center justify-around max-w-md mx-auto h-16">
              <Link href="/" className="flex flex-col items-center gap-1 px-6 py-2">
                <svg className={`w-6 h-6 transition-colors ${pathname === '/' ? 'text-brand-400' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                <span className={`text-[10px] font-medium ${pathname === '/' ? 'text-brand-400' : 'text-gray-500'}`}>Hábitos</span>
              </Link>

              <Link href="/dashboard" className="flex flex-col items-center gap-1 px-6 py-2">
                <svg className={`w-6 h-6 transition-colors ${pathname === '/dashboard' ? 'text-brand-400' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className={`text-[10px] font-medium ${pathname === '/dashboard' ? 'text-brand-400' : 'text-gray-500'}`}>Dashboard</span>
              </Link>
            </div>
          </nav>
        </div>
      </body>
    </html>
  );
}
