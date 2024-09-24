// グローバルスタイルシートをインポートする
import './globals.css'
// Google Fontsから'Inter'フォントをインポートする
import { Inter } from 'next/font/google'
// SupabaseListenerコンポーネントをインポートする
import SupabaseListener from './components/supabase-listener'
import { SessionProvider } from 'next-auth/react';

// 'Inter'フォントを初期化する
const inter = Inter({ subsets: ['latin'] })

// メタデータを設定する
export const metadata = {
  title: 'Sphere App',
  description: 'Finance System Trading System',
}

// RootLayoutコンポーネントを定義する
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <link rel="icon" href="/favicon.ico" /> {/* ファビコンの設定 */}
        {/* 他のheadタグ */}
      </head>
      {/* 'Inter'フォントを適用し、背景色を設定する */}
      <body className={`${inter.className} bg-gray-100 text-gray-900`}>
        <div className="flex flex-col min-h-screen">
          {/* SupabaseListenerコンポーネントをレンダリングする */}
          <SupabaseListener />

          {/* メインコンテンツを表示する */}
          <main className="flex-1 container max-w-7xl mx-auto px-4 py-6 bg-white shadow-md rounded-lg mt-6">
            {children}
          </main>

          {/* フッターを表示する */}
          <footer className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-0.5 mt-auto">
            <div className="container mx-auto px-4 text-center text-sm">
              &copy; MFTO, Inc.
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}