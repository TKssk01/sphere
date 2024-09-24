// TypeScriptファイルへの書き換え例: server.ts
import Stripe from 'stripe';

// Stripe APIキーの型定義を追加
const stripeSecretKey = process.env.STRIPE_SECRET_KEY as string;

// 型定義の追加
export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2024-06-20', // Stripeのバージョンを指定
});
