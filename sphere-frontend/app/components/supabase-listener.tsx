'use server';

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Navigation from './navigation';
import type { Database } from '../../lib/database.types';

// 認証状態の監視
const SupabaseListener = async () => {
  // Supabase クライアントの作成
  const supabase = createServerComponentClient<Database>({ cookies });

  // セッションの取得
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // プロフィールの取得
  let profile = null;

  if (session) {
    // 現在のプロフィールを取得
    const { data: currentProfile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (profileError) {
      console.error('プロフィール取得エラー:', profileError);
    } else {
      profile = currentProfile;

      // メールアドレスを変更した場合、プロフィールを更新
      if (currentProfile && currentProfile.email !== session.user.email) {
        // メールアドレスを更新
        const { data: updatedProfile, error: updateError } = await supabase
          .from('profiles')
          .update({ email: session.user.email } as Database['public']['Tables']['profiles']['Update']) // Update 型を使用
          .match({ id: session.user.id })
          .select('*')
          .single();

        if (updateError) {
          console.error('プロフィール更新エラー:', updateError);
        } else {
          profile = updatedProfile;
        }
      }
    }
  }

  // Navigation コンポーネントにセッションとプロフィールを渡す
  return <Navigation session={session} profile={profile} />;
};

export default SupabaseListener;
