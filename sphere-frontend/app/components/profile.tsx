'use client'
import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/lib/database.types';

const supabase = createClientComponentClient<Database>();

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [profileData, setProfileData] = useState<Database['public']['Tables']['profiles']['Row'] | null>(null);
  const [showApiPassword, setShowApiPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);

      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          throw new Error('Not authenticated');
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
      } catch (error) {
        setMessage('プロフィール情報の取得に失敗しました。');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleToggleApiPassword = () => {
    setShowApiPassword(!showApiPassword);
  };

  const handleToggleLoginPassword = () => {
    setShowLoginPassword(!showLoginPassword);
  };

  return (
    <div>
      <div className="text-center font-bold text-xl mb-10">プロフィール</div>
      {/* ロード中の表示 */}
      {loading && <p>Loading...</p>}
      {/* エラーメッセージの表示 */}
      {message && <p className="text-red-500">{message}</p>}
      {/* プロフィールデータの表示 */}
      {profileData && (
        <div>
          <div className="mb-5">
            <div className="text-sm mb-1 font-bold">名前</div>
            <p>{profileData.name}</p>
          </div>
          <div className="mb-5">
            <div className="text-sm mb-1 font-bold">メールアドレス</div>
            <p>{profileData.email}</p>
          </div>
          <div className="mb-5">
            <div className="text-sm mb-1 font-bold">料金プラン</div>
            <p>{profileData.plan_grade}</p>
          </div>
          <div className="mb-5">
            <div className="text-sm mb-1 font-bold">auカブコム API パスワード</div>
            <p>
              {showApiPassword ? profileData.aukabucom_api_password : '********'}
              <span className="ml-2 cursor-pointer" onClick={handleToggleApiPassword}>
                {showApiPassword ? '隠す' : '表示'}
              </span>
            </p>
          </div>
          <div className="mb-5">
            <div className="text-sm mb-1 font-bold">auカブコム ログインパスワード</div>
            <p>
              {showLoginPassword ? profileData.aukabucom_login_password : '********'}
              <span className="ml-2 cursor-pointer" onClick={handleToggleLoginPassword}>
                {showLoginPassword ? '隠す' : '表示'}
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;