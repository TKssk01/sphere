export const dynamic = 'force-dynamic';

import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabaseClient'; // クライアントサイドと統一
import { redirect } from 'next/navigation';
import Signup from '../../components/signup';
import type { Database } from '@/lib/database.types';

// サインアップページ
const SignupPage = async () => {
  // サーバーサイドでsupabaseクライアントを使用
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

  if (sessionError) {
    console.error('セッションの取得に失敗しました:', sessionError);
    // 必要に応じてエラーページへリダイレクト
  }

  // 認証している場合、リダイレクト
  if (sessionData.session) {
    redirect('/');
  }

  return <Signup />;
}

export default SignupPage;
