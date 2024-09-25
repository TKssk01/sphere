// app/layout.tsx (Supabaseのみを使用する場合)

import './globals.css';
import { Inter } from 'next/font/google';
import SupabaseListener from './components/supabase-listener';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Sphere App',
  description: 'Finance System Trading System',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <link rel="icon" href="/favicon.ico" />
        {/* 他のheadタグ */}
      </head>
      <body className={`${inter.className} bg-gray-100 text-gray-900`}>
        <div className="flex flex-col min-h-screen">
          <SupabaseListener />

          <main className="flex-1 container max-w-7xl mx-auto px-4 py-6 bg-white shadow-md rounded-lg mt-6">
            {children}
          </main>

          <footer className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-0.5 mt-auto">
            <div className="container mx-auto px-4 text-center text-sm">
              &copy; MFTO, Inc.
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
