// app/page/layout.tsx
import SupabaseListener from './components/supabase-listener';
import { ReactNode } from 'react';

export default function PageLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <SupabaseListener />
        {/* ナビゲーションを含めない */}
        {/* メインコンテンツのラッパーを含めない */}
        {children}
      </body>
    </html>
  );
}