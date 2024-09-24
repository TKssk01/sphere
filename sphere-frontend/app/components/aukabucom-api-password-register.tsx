'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import Loading from '@/app/loading'
import * as z from 'zod'
import type { Database } from '@/lib/database.types'
type Schema = z.infer<typeof schema>

// 入力データの検証ルールを定義
const schema = z.object({
  email: z.string().email({ message: 'メールアドレスの形式ではありません。' }),
  password: z.string().min(6, { message: '6文字以上入力する必要があります。' }),
})

// ログインページ
const Login = () => {
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    // 初期値
    defaultValues: { email: '', password: '' },
    // 入力値の検証
    resolver: zodResolver(schema),
  })

  // 送信
  const onSubmit: SubmitHandler<Schema> = async (data) => {
    setLoading(true)
    setMessage('') // メッセージをリセット

    try {
      // ログイン
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      // エラーチェック
      if (error) {
        setMessage(`ログインに失敗しました: ${error.message}`) // エラーメッセージを設定
        return
      }

      // トップページに遷移
      router.push('/')
    } catch (error) {
      setMessage('予期せぬエラーが発生しました。')
      return
    } finally {
      setLoading(false)
      router.refresh()
    }
  }

  return (
    <div className="max-w-[400px] mx-auto">
      <div className="text-center font-bold text-xl mb-10">ログイン</div>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* メールアドレス */}
        <div className="mb-3">
          <input
            type="email"
            className="border rounded-md w-full py-2 px-3 focus:outline-none focus:border-sky-500"
            placeholder="メールアドレス"
            id="email"
            {...register('email', { required: true })}
          />
          <div className="my-3 text-center text-sm text-red-500">{errors.email?.message}</div>
        </div>

        {/* パスワード */}
        <div className="mb-5">
          <input
            type="password"
            className="border rounded-md w-full py-2 px-3 focus:outline-none focus:border-sky-500"
            placeholder="パスワード"
            id="password"
            {...register('password', { required: true })}
          />
          <div className="my-3 text-center text-sm text-red-500">{errors.password?.message}</div>
        </div>

        {/* ログインボタン */}
        <div className="mb-5">
          {loading ? (
            <Loading />
          ) : (
            <button
              type="submit"
              className="font-bold bg-sky-500 hover:brightness-95 w-full rounded-full p-2 text-white text-sm"
            >
              ログイン
            </button>
          )}
        </div>
      </form>

      {message && <div className="my-5 text-center text-sm text-red-500">{message}</div>}

      <div className="text-center text-sm mb-5">
        <Link href="/auth/reset-password" className="text-gray-500 font-bold">
          パスワードを忘れた方はこちら
        </Link>
      </div>

      <div className="text-center text-sm">
        <Link href="/auth/signup" className="text-gray-500 font-bold">
          アカウントを作成する
        </Link>
      </div>
    </div>
  )
}

export default Login

// 'use client'
// // クライアントコンポーネントであることを示す
// import { useState } from 'react'
// // Reactの状態管理フックをインポート
// import { useSupabaseClient } from '@supabase/auth-helpers-react'
// // Supabaseクライアントを取得するためのカスタムフックをインポート
// import { useRouter } from 'next/navigation'
// // ルーティングを扱うためのカスタムフックをインポート

// export default function RegisterAukabucomApiPassword() {
//   // コンポーネントの定義
//   const [password, setPassword] = useState('')
//   // パスワードの状態と状態を更新する関数を定義
//   const [error, setError] = useState('')
//   // エラーメッセージの状態と状態を更新する関数を定義
//   const supabase = useSupabaseClient()
//   // Supabaseクライアントを取得
//   const router = useRouter()
//   // ルーターを取得
//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     // フォーム送信時のイベントハンドラ関数
//     e.preventDefault()
//     // フォームの標準動作をキャンセル
//     setError('')
//     // エラーメッセージをリセット
//     const { data: { user } } = await supabase.auth.getUser()
//     // 現在のユーザー情報を取得

//     try {
//       if (user) {
//         // ユーザーが存在する場合
//         const { error: insertError } = await supabase
//           .from('profiles')
//           // profilesテーブルに対して操作を行う
//           .insert({ aukabucom_api_password: password })
//           // aukabucom_api_passwordカラムにパスワードを挿入
//           .eq('id', user.id)
//           // ユーザーIDに一致するレコードを選択
//         if (insertError) {
//           // エラーが発生した場合

//           setError(insertError.message)
//           // エラーメッセージを状態に設定

//         } else {
//           // 成功した場合

//           alert('auカブコムAPIパスワードが登録されました')
//           // アラートを表示

//           router.push('/settings/aukabucom-api-password')
//           // 指定のページに遷移

//         }
//       }
//     } catch (err) {
//       // 例外が発生した場合

//       setError('エラーが発生しました')
//       // エラーメッセージを状態に設定

//     }
//   }

//   return (
//     <div>
//       {/* コンポーネントのレンダリング */}

//       <h1 className="text-2xl font-bold mb-4">auカブコムAPIパスワード登録</h1>
//       {/* タイトルを表示 */}

//       <form onSubmit={handleSubmit}>
//         {/* フォームを定義し、送信時にhandleSubmit関数を呼び出す */}

//         <div className="mb-4">
//           <label htmlFor="password" className="block font-bold mb-2">
//             新しいパスワード
//           </label>
//           <input
//             type="password"
//             id="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="border border-gray-400 p-2 w-full"
//           />
//         </div>
//         {/* パスワード入力フィールドを表示 */}

//         {error && <p className="text-red-500 mb-4">{error}</p>}
//         {/* エラーメッセージを表示 */}

//         <button
//           type="submit"
//           className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//         >
//           登録
//         </button>
//         {/* 登録ボタンを表示 */}

//       </form>
//     </div>
//   )
// }