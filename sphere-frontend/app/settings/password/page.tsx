'use client';

import Link from 'next/link';

const PasswordPage = () => {
  return (
    <div>
      <h1>パスワード設定</h1>

      <div>
        <h2>パスワードの変更</h2>
        <p>現在のパスワードを知っている場合は、こちらからパスワードを変更できます。</p>
        <Link href="/auth/reset-password" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          パスワードを変更する
        </Link>
      </div>

      <div className="mt-8">
        <h2>パスワードを忘れた場合</h2>
        <p>パスワードを忘れた場合は、こちらからパスワードをリセットできます。</p>
        <Link href="/auth/new-password" className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
          パスワードをリセットする
        </Link>
      </div>
    </div>
  );
};

export default PasswordPage;