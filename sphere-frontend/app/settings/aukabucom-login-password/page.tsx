'use client'

import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// 入力データの検証ルールを定義
const schema = z.object({
  // ログインパスワードの検証ルール
  new_password: z.string().min(8, { message: 'パスワードは8文字以上で入力してください。' }),
  confirm_password: z.string().min(8, { message: 'パスワードは8文字以上で入力してください。' }),
});


const AuKabucomLoginPassword = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });


  const onSubmit: SubmitHandler<z.infer<typeof schema>> = async (data) => {
    setLoading(true);
    setMessage('');

    // ログインパスワードの更新処理を実装
    if (data.new_password !== data.confirm_password) {
      setMessage('パスワードと確認用パスワードが一致しません。');
      setLoading(false);
      return;
    }

    // supabase またはその他の方法でログインパスワード更新

    setMessage('auカブコムログインパスワードを変更しました。');
    setLoading(false);
  };


  return (
    <div>
      <div className="text-center font-bold text-xl mb-10">auカブコムログインパスワード変更</div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-5">
          <div className="text-sm mb-1 font-bold">新しいパスワード</div>
          <input
            type="password"
            className="border rounded-md w-full py-2 px-3 focus:outline-none focus:border-sky-500"
            placeholder="新しいパスワード"
            {...register('new_password', { required: true })}
          />
          {errors.new_password && <div className="text-red-500">{errors.new_password.message}</div>}
        </div>

        <div className="mb-5">
          <div className="text-sm mb-1 font-bold">パスワード確認</div>
          <input
            type="password"
            className="border rounded-md w-full py-2 px-3 focus:outline-none focus:border-sky-500"
            placeholder="パスワード確認"
            {...register('confirm_password', { required: true })}
          />
          {errors.confirm_password && <div className="text-red-500">{errors.confirm_password.message}</div>}
        </div>

        <div className="mb-5">
          {loading ? (
            <button
              type="button"
              className="font-bold bg-sky-500 hover:brightness-95 w-full rounded-full p-2 text-white text-sm cursor-not-allowed"
              disabled
            >
              変更中...
            </button>
          ) : (
            <button
              type="submit"
              className="font-bold bg-sky-500 hover:brightness-95 w-full rounded-full p-2 text-white text-sm"
            >
              変更
            </button>
          )}
        </div>
        {message && <div className="text-red-500">{message}</div>}
      </form>
    </div>
  );
};

export default AuKabucomLoginPassword;