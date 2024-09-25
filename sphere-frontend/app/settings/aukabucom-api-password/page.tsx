'use client'

import { useState } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'

export default function AukabucomApiPasswordPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const supabase = useSupabaseClient()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')  
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
        setError('ユーザー情報の取得に失敗しました。')
        return
    }

  
    try {
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('aukabucom_api_password')
          .eq('id', user.id)
          .single()
  
        if (error) {
          setError(error.message)
        } else {
          // aukabucom_api_passwordカラムの値が存在しない(NULL)場合の処理
          if (data.aukabucom_api_password === null) {
            const { error: updateError } = await supabase
              .from('profiles')
              .update({ aukabucom_api_password: password })
              .eq('id', user.id)
  
            if (updateError) {
              setError(updateError.message)
            } else {
              alert('auカブコムAPIパスワードが更新されました')
            }
          } else {
            // aukabucom_api_passwordカラムの値が存在する場合の処理
            setError('auカブコムAPIパスワードは既に設定されています')
          }
        }
      }
    } catch (err) {
      setError('エラーが発生しました')
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">auカブコムAPIパスワード</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="password" className="block font-bold mb-2">
            新しいパスワード
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-400 p-2 w-full"
          />
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          更新
        </button>
      </form>
    </div>
  )
}