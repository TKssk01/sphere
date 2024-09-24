'use client'

import Link from 'next/link'
import useStore from '@/store'
import { useEffect } from 'react'
import type { Session } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/lib/database.types'
type ProfileType = Database['public']['Tables']['profiles']['Row']

// ナビゲーション
const Navigation = ({
  session,
  profile,
}: {
  session: Session | null
  profile: ProfileType | null
}) => {
  const updateProfile = useStore((state) => state.updateProfile); // updateProfile 関数を取得

  // 状態管理にユーザー情報を保存
  useEffect(() => {
    if (session) {
      updateProfile({ // updateProfile 関数を使って状態を更新
        id: session.user.id,
        email: session.user.email!,
        name: profile ? profile.name : null,
        plan_grade: profile ? profile.plan_grade : 'free',
        aukabucom_api_password: profile ? profile.aukabucom_api_password : null,
        aukabucom_login_password: profile ? profile.aukabucom_login_password : null, // 必ず渡す
      });
    }
  }, [session, updateProfile, profile]); // updateProfile を依存配列に追加

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
  )
}

export default Navigation

// 'use client'

// import Link from 'next/link'
// import useStore from '@/store'
// import Image from 'next/image'
// import { useEffect } from 'react'
// import type { Session } from '@supabase/auth-helpers-nextjs'
// import type { Database } from '@/lib/database.types'
// type ProfileType = Database['public']['Tables']['profiles']['Row']

// // ナビゲーション
// const Navigation = ({
//   session,
//   profile,
// }: {
//   session: Session | null
//   profile: ProfileType | null
// }) => {
//   const { setUser } = useStore()

//   // 状態管理にユーザー情報を保存
//   useEffect(() => {
//     setUser({
//       id: session ? session.user.id : '',
//       email: session ? session.user.email! : '',
//       name: session && profile ? profile.name : '',
//       introduce: session && profile ? profile.introduce : '',
//       avatar_url: session && profile ? profile.avatar_url : '',
//     })
//   }, [session, setUser, profile])

//   return (
//     <header className="shadow-lg shadow-gray-100">
//       <div className="py-5 container max-w-screen-sm mx-auto flex items-center justify-between">
//         <Link href="/" className="font-bold text-xl cursor-pointer">
//           FullStackChannel
//         </Link>

//         <div className="text-sm font-bold">
//           {session ? (
//             <div className="flex items-center space-x-5">
//               <Link href="/settings/profile">
//                 <div className="relative w-10 h-10">
//                   <Image
//                     src={profile && profile.avatar_url ? profile.avatar_url : '/default.png'}
//                     className="rounded-full object-cover"
//                     alt="avatar"
//                     fill
//                   />
//                 </div>
//               </Link>
//             </div>
//           ) : (
//             <div className="flex items-center space-x-5">
//               <Link href="/auth/login">ログイン</Link>
//               <Link href="/auth/signup">サインアップ</Link>
//             </div>
//           )}
//         </div>
//       </div>
//     </header>
//   )
// }

// export default Navigation
