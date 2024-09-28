// app/components/LayoutWrapper.tsx

'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface LayoutWrapperProps {
  children: ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <div className={isHomePage ? 'bg-gradient-to-b from-blue-900 to-blue-600 text-white min-h-screen' : 'bg-gray-100 text-gray-900 min-h-screen'}>
      {!isHomePage && (
        <header className="flex justify-between items-center p-4 bg-white shadow-md">
          <h1 className="text-2xl font-bold">Sphere</h1>
          {/* 必要に応じてナビゲーションリンクを追加 */}
        </header>
      )}
      <main className={isHomePage ? 'container mx-auto px-4 py-8 flex flex-col items-center' : 'flex-1 container max-w-7xl mx-auto px-4 py-6 bg-white shadow-md rounded-lg mt-6'}>
        {children}
      </main>
      {!isHomePage && (
        <footer className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 mt-auto">
          <div className="container mx-auto px-4 text-center text-sm">
            &copy; MFTO, Inc.
          </div>
        </footer>
      )}
    </div>
  );
}
