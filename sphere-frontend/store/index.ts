// Zustand Reactの状態管理ライブラリ
// https://github.com/pmndrs/zustand
import { create } from 'zustand';
import type { Database } from '@/lib/database.types';

type ProfileType = Database['public']['Tables']['profiles']['Row'];

type StateType = {
  user: ProfileType;
  setUser: (payload: ProfileType) => void;
};

const useStore = create<StateType>((set) => ({
  user: { 
    id: '', 
    email: '', 
    name: null, 
    plan_grade: 'free', 
    aukabucom_api_password: null, 
    aukabucom_login_password: null 
  },
  setUser: (payload) => set({ user: payload }),
}));

export default useStore;

