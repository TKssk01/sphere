'use client'
import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import type { Database } from '@/lib/database.types';

const supabase = createClientComponentClient<Database>();

const EditPassword = () => {
  const router = useRouter(); 
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [profileData, setProfileData] = useState<Database['public']['Tables']['profiles']['Row'] | null>(null);
  const [apiPassword, setApiPassword] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [currentApiPassword, setCurrentApiPassword] = useState(''); 
  const [currentLoginPassword, setCurrentLoginPassword] = useState(''); 

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);

      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          router.push('/auth'); // 認証されていない場合はログインページへリダイレクト
          return;
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('id, name, email, plan_grade, aukabucom_api_password, aukabucom_login_password')
          .eq('id', session.user.id)
          .single();

        if (error) {
          throw error;
        }

        setProfileData(data);
        setCurrentApiPassword(data.aukabucom_api_password || ''); 
        setCurrentLoginPassword(data.aukabucom_login_password || ''); 
      } catch (error) {
        setMessage('プロフィール情報の取得に失敗しました。');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        throw new Error('Not authenticated');
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          aukabucom_api_password: apiPassword,
          aukabucom_login_password: loginPassword,
        })
        .eq('id', session.user.id);

      if (updateError) {
        throw updateError;
      }

      setMessage('パスワードが更新されました。');
      // リロード
      router.refresh(); 
    } catch (error) {
      setMessage('パスワードの更新に失敗しました。');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="text-center font-bold text-xl mb-10">パスワード変更</div>
      {/* ロード中の表示 */}
      {loading && <p>Loading...</p>}
      {/* エラーメッセージの表示 */}
      {message && <p className="text-red-500">{message}</p>}
      {/* パスワード変更フォーム */}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="currentApiPassword">
            現在のauカブコムAPIパスワード
          </label>
          {currentApiPassword ? (
            <>
              <p>現在のパスワード: {currentApiPassword}</p> 
            </>
          ) : (
            <p>まだ設定していません</p>
          )}
          <label className="block text-sm font-bold mb-2" htmlFor="apiPassword">
            新しいauカブコムAPIパスワード
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="apiPassword"
            type="password"
            value={apiPassword}
            onChange={(e) => setApiPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="currentLoginPassword">
            現在のauカブコムログインパスワード
          </label>
          {currentLoginPassword ? (
            <>
              <p>現在のパスワード: {currentLoginPassword}</p>
            </>
          ) : (
            <p>まだ設定していません</p>
          )}
          <label className="block text-sm font-bold mb-2" htmlFor="loginPassword">
            新しいauカブコムログインパスワード
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="loginPassword"
            type="password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            required
          />
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
          disabled={loading}
        >
          更新
        </button>
      </form>
    </div>
  );
};

export default EditPassword; 