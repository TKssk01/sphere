import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { redirect } from 'next/navigation'
import RegisterAukabucomApiPassword from '../../components/aukabucom-api-password-register'
import type { Database } from '@/lib/database.types'

// パスワード変更ページ
const RegisterAukabucomApiPasswordPage = async () => {
  const supabase = createServerComponentClient<Database>({
    cookies,
  })

  // セッションの取得
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // 未認証の場合、リダイレクト
  if (!session) {
    redirect('/auth/login')
  }

  return <RegisterAukabucomApiPassword />
}

export default RegisterAukabucomApiPasswordPage
