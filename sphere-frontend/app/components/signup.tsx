'use client' // クライアントサイドで実行されるコンポーネントであることを示す

import { useState } from 'react' // ReactのuseStateフックをインポート
import { supabase } from '@/lib/supabaseClient' // Supabaseクライアントをインポート
import { useRouter } from 'next/navigation' // Next.jsのルーターをインポート
import { useForm, SubmitHandler } from 'react-hook-form' // React Hook Formをインポート
import { zodResolver } from '@hookform/resolvers/zod' // ZodとReact Hook Formを連携させるためのResolverをインポート
import Link from 'next/link' // Next.jsのLinkコンポーネントをインポート
import Loading from '@/app/loading' // ローディングコンポーネントをインポート
import * as z from 'zod' // Zodをインポート
import type { Database } from '@/lib/database.types' // データベースの型定義をインポート

// Zodを使用してフォームのバリデーションスキーマを定義
const schema = z.object({
  name: z.string().min(2, { message: '2文字以上入力する必要があります。' }), // 名前は2文字以上
  email: z.string().email({ message: 'メールアドレスの形式ではありません。' }), // 有効なメールアドレス形式
  password: z.string().min(6, { message: '6文字以上入力する必要があります。' }), // パスワードは6文字以上
})

// スキーマから型を推論
type Schema = z.infer<typeof schema>

// `profiles`テーブルに挿入するデータの型を定義
type ProfilesInsert = {
  id: string
  name: string
  email: string
}

const Signup = () => {
  const router = useRouter() // ルーターを使用してページのリフレッシュやリダイレクトを行う
  const [loading, setLoading] = useState(false) // ローディング状態を管理
  const [message, setMessage] = useState('') // ユーザーへのメッセージを管理

  // React Hook Formを初期化
  const {
    register, // フォームの入力フィールドを登録
    handleSubmit, // フォーム送信時のハンドラー
    formState: { errors }, // バリデーションエラーを取得
    reset, // フォームのリセット関数
  } = useForm<Schema>({
    defaultValues: { name: '', email: '', password: '' }, // フォームの初期値
    resolver: zodResolver(schema), // Zodスキーマを使用してバリデーション
  })

  // フォーム送信時のハンドラー関数
  const onSubmit: SubmitHandler<Schema> = async (data) => {
    setLoading(true) // ローディング状態を開始
    setMessage('') // 以前のメッセージをクリア

    try {
      // Supabase Authを使用して新しいユーザーをサインアップ
      const { data: signUpData, error: errorSignup } = await supabase.auth.signUp({
        email: data.email, // フォームから取得したメールアドレス
        password: data.password, // フォームから取得したパスワード
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`, // 認証後のリダイレクトURL
        },
      })

      // サインアップ時にエラーが発生した場合
      if (errorSignup) {
        setMessage('サインアップエラー: ' + errorSignup.message) // エラーメッセージを設定
        console.error('Sign-up Error:', errorSignup) // コンソールにエラーを出力
        return // 処理を中断
      }

      // サインアップが成功し、ユーザーオブジェクトが存在する場合
      if (signUpData.user) {
        const user = signUpData.user // signUpDataからユーザーオブジェクトを取得

        // `profiles`テーブルにデータを挿入
        const profile: ProfilesInsert = {
          id: user.id, // ユーザーのID
          name: data.name, // フォームから取得した名前
          email: data.email, // フォームから取得したメールアドレス
        }

        // `profiles`テーブルにプロファイルデータを挿入
        const { error: insertError } = await supabase.from('profiles').insert(profile)

        // プロフィールの挿入時にエラーが発生した場合
        if (insertError) {
          setMessage('プロフィール登録エラー: ' + insertError.message) // エラーメッセージを設定
          console.error('Profile Insert Error:', insertError) // コンソールにエラーを出力
          return // 処理を中断
        }

        reset() // フォームをリセット
        setMessage(
          '本登録用のURLを記載したメールを送信しました。メールをご確認の上、メール本文中のURLをクリックして、本登録を行ってください。'
        ) // 成功メッセージを設定
      }
    } catch (error: any) { // 予期せぬエラーをキャッチ
      setMessage('予期せぬエラーが発生しました。' + error.message) // エラーメッセージを設定
      console.error('Unexpected Error:', error) // コンソールにエラーを出力
    } finally {
      setLoading(false) // ローディング状態を終了
      router.refresh() // ページをリフレッシュ
    }
  }

  return (
    <div className="max-w-[400px] mx-auto"> {/* 最大幅400pxの中央揃えコンテナ */}
      <div className="text-center font-bold text-xl mb-10">サインアップ</div> {/* タイトル */}
      <form onSubmit={handleSubmit(onSubmit)}> {/* フォーム送信時にonSubmitを呼び出す */}
        {/* 名前入力フィールド */}
        <div className="mb-3">
          <input
            type="text" // テキスト入力
            className="border rounded-md w-full py-2 px-3 focus:outline-none focus:border-sky-500" // スタイル
            placeholder="名前" // プレースホルダー
            id="name" // ID属性
            {...register('name', { required: true })} // React Hook Formで登録
          />
          {/* バリデーションエラー表示 */}
          <div className="my-3 text-center text-sm text-red-500">{errors.name?.message}</div>
        </div>

        {/* メールアドレス入力フィールド */}
        <div className="mb-3">
          <input
            type="email" // メール入力
            className="border rounded-md w-full py-2 px-3 focus:outline-none focus:border-sky-500" // スタイル
            placeholder="メールアドレス" // プレースホルダー
            id="email" // ID属性
            {...register('email', { required: true })} // React Hook Formで登録
          />
          {/* バリデーションエラー表示 */}
          <div className="my-3 text-center text-sm text-red-500">{errors.email?.message}</div>
        </div>

        {/* パスワード入力フィールド */}
        <div className="mb-5">
          <input
            type="password" // パスワード入力
            className="border rounded-md w-full py-2 px-3 focus:outline-none focus:border-sky-500" // スタイル
            placeholder="パスワード" // プレースホルダー
            id="password" // ID属性
            {...register('password', { required: true })} // React Hook Formで登録
          />
          {/* バリデーションエラー表示 */}
          <div className="my-3 text-center text-sm text-red-500">{errors.password?.message}</div>
        </div>

        {/* サインアップボタン */}
        <div className="mb-5">
          {loading ? ( // ローディング中はLoadingコンポーネントを表示
            <Loading />
          ) : (
            <button
              type="submit" // ボタンクリックでフォーム送信
              className="font-bold bg-sky-500 hover:brightness-95 w-full rounded-full p-2 text-white text-sm" // スタイル
            >
              サインアップ
            </button>
          )}
        </div>
      </form>

      {/* ユーザーへのメッセージ表示 */}
      {message && <div className="my-5 text-center text-sm text-red-500">{message}</div>}

      {/* ログインページへのリンク */}
      <div className="text-center text-sm">
        <Link href="/auth/login" className="text-gray-500 font-bold">
          ログインはこちら
        </Link>
      </div>
    </div>
  )
}

export default Signup // Signupコンポーネントをエクスポート
