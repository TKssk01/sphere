import React from 'react';

const FAQPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">FAQセクション</h1>
      <div className="mb-4">
        <h3 className="text-xl font-bold">質問1: ここに質問を記載します</h3>
        <p className="text-lg">ここに質問1の回答を記載します。</p>
      </div>
      <div className="mb-4">
        <h3 className="text-xl font-bold">質問2: ここに質問を記載します</h3>
        <p className="text-lg">ここに質問2の回答を記載します。</p>
      </div>
      {/* 必要に応じてFAQを追加 */}
    </div>
  );
};

export default FAQPage;