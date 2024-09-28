// app/homepage/layout.tsx

'use client';

import { ReactNode } from 'react';

export default function HomepageLayout({ children }: { children: ReactNode }) {
  return (
    <html>
      <head>
        <title>Sphere</title>
        <link rel="icon" href="/favicon.ico" />
        {/* 必要に応じて他のheadタグを追加 */}
      </head>
      <body className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-600 text-white">
        {children}
      </body>
    </html>
  );
}
