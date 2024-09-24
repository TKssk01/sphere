'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Loading from '@/app/loading';
import * as z from 'zod';
import type { Database } from '@/lib/database.types';

const supabase = createClientComponentClient<Database>();

// 入力データの検証ルールを定義
const schema = z.object({
  oldPassword: z.string().min(6, { message: '6文字以上入力してください' }),
  newPassword: z.string().min(6, { message: '6文字以上入力してください' }),
});

type Schema = z.infer<typeof schema>;

const PasswordPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { oldPassword: '', newPassword: '' },
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<Schema> = async (data) => {
    setLoading(true);
    setMessage('');

    try {
      // パスワード変更APIを呼び出す
      const { error } = await supabase.auth.updateUser({
        password: data.newPassword,
      });

      if (error) {
        setMessage('エラーが発生しました: ' + error.message);
        return;
      }

      setMessage('パスワードが変更されました。');
    } catch (error) {
      setMessage('エラーが発生しました: ' + error);
      return;
    } finally {
      setLoading(false);
      // router.refresh(); // 必要に応じてリフレッシュ
    }
  };

  return (
    <div className="max-w-[400px] mx-auto">
      <div className="text-center font-bold text-xl mb-10">パスワード変更</div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-5">
          <div className="text-sm mb-1 font-bold">現在のパスワード</div>
          <input
            type="password"
            className="border rounded-md w-full py-2 px-3 focus:outline-none focus:border-sky-500"
            placeholder="現在のパスワード"
            id="oldPassword"
            {...register('oldPassword', { required: true })}
          />
          <div className="my-3 text-center text-sm text-red-500">{errors.oldPassword?.message}</div>
        </div>

        <div className="mb-5">
          <div className="text-sm mb-1 font-bold">新しいパスワード</div>
          <input
            type="password"
            className="border rounded-md w-full py-2 px-3 focus:outline-none focus:border-sky-500"
            placeholder="新しいパスワード"
            id="newPassword"
            {...register('newPassword', { required: true })}
          />
          <div className="my-3 text-center text-sm text-red-500">{errors.newPassword?.message}</div>
        </div>

        <div className="mb-5">
          {loading ? (
            <Loading />
          ) : (
            <button
              type="submit"
              className="font-bold bg-sky-500 hover:brightness-95 w-full rounded-full p-2 text-white text-sm"
            >
              変更する
            </button>
          )}
        </div>
      </form>

      {message && <div className="my-5 text-center text-sm text-red-500">{message}</div>}
    </div>
  );
};

export default PasswordPage;