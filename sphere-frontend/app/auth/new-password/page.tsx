'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/lib/database.types';

const supabase = createClientComponentClient<Database>();

export default function NewPassword() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
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

      // APIルートにリクエストを送信
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessToken,
          newPassword: password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'パスワードの更新に失敗しました');
      }

      setMessage('パスワードが再設定されました。');
      setPassword('');
      router.push('/auth/login');
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('予期しないエラーが発生しました');
      }
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
