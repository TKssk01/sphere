"use client";

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

interface User {
  name?: string | null;
  email?: string | null;
  plan_grade?: string; // plan_grade プロパティを追加
}

interface Session {
  user: User;
  // 他のプロパティ...
}

export default function ClientPlanPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    console.log('Session status:', status);
    console.log('Session data:', session);
  }, [session, status]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated" || !session) {
    return (
      <div>
        <p>Access Denied. Please sign in.</p>
        <p>Authentication status: {status}</p>
        <button onClick={() => window.location.href = '/api/auth/signin'}>
          Sign In
        </button>
      </div>
    );
  }

  // セッションはあるがユーザー情報が欠落している場合
  if (!session.user || !session.user.email) {
    return (
      <div>
        <p>User information is incomplete.</p>
        <p>Session exists, but user data is missing.</p>
        <pre>{JSON.stringify(session, null, 2)}</pre>
      </div>
    );
  }

  // ユーザーのプランを取得
  const currentPlan = (session.user as any).plan_grade || 'Free'; // 型アサーションを使用

  return (
    <div>
      <h1>Welcome, {session.user.name || 'User'}</h1>
      <p>Your email: {session.user.email}</p>
      <p>Your current plan: {currentPlan}</p>

      <h2>Available Plans</h2>
      <div>
        <h3>Basic Plan</h3>
        <p>Features: Access to basic features.</p>
        <button onClick={() => router.push('/purchase?plan=basic')}>
          Purchase Basic Plan
        </button>
      </div>
      <div>
        <h3>Premium Plan</h3>
        <p>Features: Access to all features including premium support.</p>
        <button onClick={() => router.push('/purchase?plan=premium')}>
          Purchase Premium Plan
        </button>
      </div>

      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
}