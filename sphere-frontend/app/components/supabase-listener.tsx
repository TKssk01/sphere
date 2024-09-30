// components/SupabaseListener.tsx
'use server';

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies, headers } from 'next/headers';
import Navigation from './navigation';
import type { Database } from '../../lib/database.types';

const SupabaseListener = async () => {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  let profile = null;

  if (session) {
    const { data: currentProfile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (profileError) {
      console.error('プロフィール取得エラー:', profileError);
    } else {
      profile = currentProfile;

      if (currentProfile.email !== session.user.email) {
        const { data: updatedProfile, error: updateError } = await supabase
          .from('profiles')
          .update({ email: session.user.email } as Database['public']['Tables']['profiles']['Update'])
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

  // 現在のURLをヘッダーから取得
  const reqHeaders = headers();
  const referer = reqHeaders.get('referer') || '';
  let pathname = '';

  try {
    const url = new URL(referer);
    pathname = url.pathname;
  } catch (error) {
    // refererが無効な場合や取得できない場合のフォールバック
    pathname = '/';
  }

  // トップページ以外の場合に Navigation を表示
  if (pathname !== '111') {
    return <Navigation session={session} profile={profile} />;
  }

  return null;
};

export default SupabaseListener;
