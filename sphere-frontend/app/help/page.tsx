import Link from 'next/link';

const Help = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">ヘルプページ</h1>
      <ul className="list-disc list-inside">
        <li>
          <Link href="/help/usage">
            基本的な使用方法の説明
          </Link>
        </li>
        <li>
          <Link href="/help/faq">
            FAQセクション
          </Link>
        </li>
        <li>
          <Link href="/help/contact">
            サポート連絡先情報
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Help;