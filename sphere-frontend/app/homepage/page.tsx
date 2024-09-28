"use client" // 必ずファイルの最初の行に配置

import { useState, useEffect } from 'react';
import { Globe, Menu } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '../../lib/supabaseClient'; // Supabase クライアントをインポート
import { Session } from '@supabase/supabase-js';

export default function SphereHomepage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 現在のセッションを取得
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        setError(error.message);
        console.error('セッション取得エラー:', error);
      }
      setSession(session);
      setLoading(false);
    });

    // セッションの変化をリッスン
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    // クリーンアップ
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 to-blue-600 text-white">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-600 text-white relative z-50">
      
      {isMenuOpen && (
        <div className="md:hidden bg-blue-800 bg-opacity-90 backdrop-blur-md fixed inset-0">
          <nav className="container mx-auto px-4 py-4">
            <ul className="space-y-2">
              <li><Link href="/dashboard" className="block hover:text-blue-300 transition-colors">Dashboard</Link></li>
              <li><Link href="/markets" className="block hover:text-blue-300 transition-colors">Markets</Link></li>
              <li><Link href="/account" className="block hover:text-blue-300 transition-colors">Account</Link></li>
            </ul>
          </nav>
        </div>
      )}
      
      <header className="absolute top-4 left-4 right-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Sphere</h1>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="メニューを開く">
          <Menu className="w-6 h-6" />
        </button>
      </header>
      
      <main className="container mx-auto px-4 py-8 flex flex-col items-center">
        <div className="w-64 h-64 md:w-96 md:h-96 relative mb-8">
          <svg viewBox="0 0 200 200" className="w-full h-full" aria-label="Stylized globe representing Sphere's global financial network">
            <defs>
              <linearGradient id="globe-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4299E1" />
                <stop offset="100%" stopColor="#2B6CB0" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <circle cx="100" cy="100" r="95" fill="url(#globe-gradient)" />
            <g filter="url(#glow)">
              <path d="M100,5 A95,95 0 0,1 100,195 A95,95 0 0,1 100,5 Z" fill="none" stroke="#63B3ED" strokeWidth="0.5" />
              <path d="M5,100 A95,95 0 0,1 195,100 A95,95 0 0,1 5,100 Z" fill="none" stroke="#63B3ED" strokeWidth="0.5" />
              <path d="M30,70 Q100,10 170,70 T170,130 Q100,190 30,130 T30,70" fill="none" stroke="#90CDF4" strokeWidth="0.5" />
            </g>
            <g className="text-start fill-current">
              <text x="95" y="40" textAnchor="end">NYC</text>
              <text x="140" y="70">Tokyo</text>
              <text x="20" y="150">London</text>
              <text x="140" y="160">Sydney</text>
            </g>
            <g fill="#FCD34D">
              <circle cx="105" cy="35" r="2" />
              <circle cx="165" cy="65" r="2" />
              <circle cx="45" cy="125" r="2" />
              <circle cx="145" cy="155" r="2" />
            </g>
            <g className="text-xs fill-current">
              <text x="100" y="110" textAnchor="middle" className="text-lg font-bold">Sphere</text>
              <text x="100" y="125" textAnchor="middle">Global Network</text>
            </g>
          </svg>
          {/* 「Sphere」テキストを地球儀の上に配置 */}
          <h1 className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl font-bold">
            Sphere
          </h1>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Global Financial Insights</h2>
        <p className="text-xl mb-8 text-center max-w-2xl">
          Explore worldwide market trends and make informed decisions with Sphere advanced trading system.
        </p>

        {/* 認証状態に基づくレンダリング */}
        <div className="mt-12 w-full max-w-md">
          {session ? (
            <Link href="/dashboard" className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-center">
              ダッシュボードへ
            </Link>
          ) : (
            <div className="flex flex-col space-y-4">
              <Link href="/auth/login" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-center">
                ログイン
              </Link>
              <Link href="/auth/signup" className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-center">
                新規登録
              </Link>
              <button
                onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })}
                className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Googleでログイン
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
