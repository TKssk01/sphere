'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/lib/database.types';

const supabase = createClientComponentClient<Database>();

export default function NewPassword() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<Error | null>(null);
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    setError(null);
    setMessage('');
  
    try {
      const accessToken = new URLSearchParams(window.location.search).get('access_token');
      if (!accessToken) {
        throw new Error('アクセストークンがありません');
      }
  
      // 修正: updateUser() の戻り値の型を Session | null に変更
      const { data, error }: { data: Session | null; error: Error | null } = await supabase.auth.updateUser(accessToken, {
        password,
      });
  
      if (error) {
        throw error;
      }
  
      // data を使用する場合は、data が null でないことを確認
      if (data) {
        // data を使用した処理
      }
  
      setMessage('パスワードが再設定されました。');
      setPassword('');
      router.push('/auth/login'); 
    } catch (error) {
      setError(error);
    }
  };

  return (
    <div>
      <h1>新しいパスワードを設定</h1>
      {error && <p className="text-red-500">{error}</p>}
      {message && <p className="text-green-500">{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="password">新しいパスワード</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>
        <button type="submit">パスワードを設定</button>
      </form>
    </div>
  );
}