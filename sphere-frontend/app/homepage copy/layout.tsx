'use client';

import './globals.css'; // 必要に応じてスタイルをインポート
import { Inter } from 'next/font/google';
import SupabaseListener from '../components/supabase-listener';
import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Sphere',
  description: 'Finance System Trading System',
};

interface HomepageLayoutProps {
  children: ReactNode;
}

export default function HomepageLayout({ children }: HomepageLayoutProps) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        {/* 他のheadタグが必要であれば追加 */}
      </head>
      <body className={`${inter.className} bg-gray-100 text-gray-900`}>
        <div className="flex flex-col min-h-screen">
          {/* SupabaseListenerコンポーネントをレンダリングする */}
          <SupabaseListener />

          {/* メインコンテンツを表示する */}
          <main className="flex-1 container max-w-7xl mx-auto px-4 py-6 bg-white shadow-md rounded-lg mt-6">
            {children}
          </main>

          {/* フッターを表示する */}
          <footer className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 mt-auto">
            <div className="container mx-auto px-4 text-center text-sm">
              &copy; 2024 MFTO, Inc.
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
