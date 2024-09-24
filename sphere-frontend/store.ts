/* 
store.ts の機能:
グローバルな状態管理: アプリケーション全体で共有される状態を管理します。
状態の更新: 状態変数を更新するための関数を提供します。
データの共有: 複数のコンポーネントで同じ状態にアクセスし、データを共有できます。

store.ts の役割:
状態を集中管理: アプリケーションの状態を1つのファイルに集中管理することで、コードの可読性と保守性を向上させることができます。
データの一貫性: 状態の更新は、useStoreフックで定義された関数を通してのみ行われるため、状態の一貫性を保つことができます。
コンポーネント間のデータ共有: 複数のコンポーネントで同じ状態にアクセスできるため、コンポーネント間でデータを共有できます。
*/


import { create } from 'zustand';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/lib/database.types';

// ユーザー情報を格納する型を定義
interface Profile {
  // ユーザーのプロフィール情報
  id: string;
  email: string;
  name: string | null;
  plan_grade: string;
  aukabucom_api_password: string | null; 
  aukabucom_login_password: string | null; 
}

// store hookを定義
// Storeインターフェースを定義
interface Store {
  profile: Profile | null; // Profile型で初期化
  updateProfile: (newProfile: Profile) => void; // profileを更新する関数
}

// useStoreフックを定義
const useStore = create<Store>()((set) => ({
  // profile状態をProfile型で初期化
  profile: null as Profile | null, 
  // profileを更新する関数
  updateProfile: (newProfile: Profile) => set({ profile: newProfile }), 
}));

export default useStore;

// Supabaseクライアントを定義
const supabase = createClientComponentClient<Database>();