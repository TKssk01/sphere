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

const schema = z.object({
  name: z.string().min(2, { message: '2文字以上入力する必要があります。' }),
  email: z.string().email({ message: 'メールアドレスの形式ではありません。' }),
  password: z.string().min(6, { message: '6文字以上入力する必要があります。' }),
})

type Schema = z.infer<typeof schema>

type ProfilesUpdate = Partial<Database['public']['Tables']['profiles']['Row']>

const Signup = () => {
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Schema>({
    defaultValues: { name: '', email: '', password: '' },
    resolver: zodResolver(schema),
  })

  const onSubmit: SubmitHandler<Schema> = async (data) => {
    setLoading(true)

    try {
      const { error: errorSignup } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${location.origin}/auth/callback`,
        },
      })

      if (errorSignup) {
        setMessage('エラーが発生しました。' + errorSignup.message)
        return
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update<ProfilesUpdate>({ name: data.name })
        .eq('email', data.email)

      if (updateError) {
        setMessage('エラーが発生しました。' + updateError.message)
        return
      }

      reset()
      setMessage(
        '本登録用のURLを記載したメールを送信しました。メールをご確認の上、メール本文中のURLをクリックして、本登録を行ってください。'
      )
    } catch (error) {
      setMessage('エラーが発生しました。' + error)
      return
    } finally {
      setLoading(false)
      router.refresh()
    }
  }

  return (
    <div className="max-w-[400px] mx-auto">
      <div className="text-center font-bold text-xl mb-10">サインアップ</div>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* 名前 */}
        <div className="mb-3">
          <input
            type="text"
            className="border rounded-md w-full py-2 px-3 focus:outline-none focus:border-sky-500"
            placeholder="名前"
            id="name"
            {...register('name', { required: true })}
          />
          <div className="my-3 text-center text-sm text-red-500">{errors.name?.message}</div>
        </div>

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

        {/* サインアップボタン */}
        <div className="mb-5">
          {loading ? (
            <Loading />
          ) : (
            <button
              type="submit"
              className="font-bold bg-sky-500 hover:brightness-95 w-full rounded-full p-2 text-white text-sm"
            >
              サインアップ
            </button>
          )}
        </div>
      </form>

      {message && <div className="my-5 text-center text-sm text-red-500">{message}</div>}

      <div className="text-center text-sm">
        <Link href="/auth/login" className="text-gray-500 font-bold">
          ログインはこちら
        </Link>
      </div>
    </div>
  )
}

export default Signup
