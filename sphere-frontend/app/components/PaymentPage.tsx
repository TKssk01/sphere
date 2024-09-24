"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const Payment = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/checkout_session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_id: 'dummy-customer-id',  // ダミーの顧客ID
          price_id: 'dummy-price-id',        // ダミーの商品ID
        }),
      });
      const data = await response.json();
      router.push(data.checkout_url || '/dummy-success'); // ダミーURLにリダイレクト
    } catch (error) {
      console.error('Error creating checkout session:', error);
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Stripe Test購入画面</h1>
      <button
        style={{ display: 'block', margin: '20px auto', padding: '10px 20px', fontSize: '16px' }}
        onClick={handleCheckout}
        disabled={loading}
      >
        {loading ? '処理中...' : '商品購入ボタン'}
      </button>
      <p style={{ color: 'grey' }}>ダミーデータを使用してテストしています。</p>
    </div>
  );
};

export default Payment;
