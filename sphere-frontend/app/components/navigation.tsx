'use client';

import Link from 'next/link';
import useStore from '@/store';
import { useEffect } from 'react';
import type { Session } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/lib/database.types';
type ProfileType = Database['public']['Tables']['profiles']['Row'];

// ナビゲーション
const Navigation = ({
  session,
  profile,
}: {
  session: Session | null;
  profile: ProfileType | null;
}) => {
  const updateProfile = useStore((state) => state.updateProfile); // updateProfile 関数を取得

  // 状態管理にユーザー情報を保存
  useEffect(() => {
    if (session) {
      updateProfile({
        id: session.user.id,
        email: session.user.email!,
        name: profile?.name ?? '', // デフォルト値を設定
        plan_grade: profile?.plan_grade ?? 'free', // デフォルト値を設定
        aukabucom_api_password: profile?.aukabucom_api_password ?? null, // 必要に応じて
        aukabucom_login_password: profile?.aukabucom_login_password ?? null, // 必ず渡す
      });
    }
  }, [session, updateProfile, profile]);

  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 shadow-md">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-2xl cursor-pointer">
          Sphere
        </Link>

        <div className="text-1xl font-bold">
          {session ? (
            <div className="flex items-center space-x-5">
              <Link href="/dashboard" className="text-1xl">Dashboard</Link>
              <Link href="/settings/profile" className="text-1xl">Profile</Link>
              <Link href="/plan" className="text-1xl">Plan</Link>
              <Link href="/help" className="text-1xl text-white">Help</Link> 
            </div>
          ) : (
            <div className="flex items-center space-x-5">
              <Link href="/auth/login" className="text-1xl text-white">Login</Link>
              <Link href="/auth/signup" className="text-1xl text-white">SignUp</Link>
              <Link href="/help" className="text-1xl text-white">Help</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navigation;
