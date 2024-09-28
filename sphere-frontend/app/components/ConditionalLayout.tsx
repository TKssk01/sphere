// app/components/ConditionalLayout.tsx

'use client';

import { useRouter } from 'next/router';
import { ReactNode } from 'react';

interface ConditionalLayoutProps {
  children: ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const router = useRouter();
  const isHomePage = router.pathname === '/';

  if (isHomePage) {
    return <>{children}</>;
  }

  return (
    <>
      <header className="flex justify-between items-center p-4 bg-white shadow-md">
        <h1 className="text-2xl font-bold">Spherp</h1>
        {/* 必要に応じてナビゲーションリンクを追加 */}
      </header>

      <main className="flex-1 container max-w-7xl mx-auto px-4 py-6 bg-white shadow-md rounded-lg mt-6">
        {children}
      </main>

      <footer className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4">
        <div className="container mx-auto px-4 text-center text-sm">
          &copy; MFTO, Inc.
        </div>
      </footer>
    </>
  );
}
