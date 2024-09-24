"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/lib/database.types';

const supabase = createClientComponentClient<Database>();

export default function PlanPage() {
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserPlan = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('plan_grade')
            .eq('id', session.user.id)
            .single();

          if (error) {
            throw error;
          }

          setCurrentPlan(profile?.plan_grade || 'free');
        } else {
          setCurrentPlan('free');
        }
      } catch (error) {
        console.error('プラン情報の取得に失敗しました', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPlan();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Welcome to Our Plans</h1>
      <h2 className="text-xl font-semibold mt-6">Available Plans</h2>
      <div className="flex justify-around mt-4">
        {/* Free Plan */}
        <div className="border border-gray-300 rounded-lg p-6 w-1/2 text-center shadow-md">
          <h3 className="text-lg font-semibold mb-2">Free Plan</h3>
          <p className="mb-4">Features: Access to free features.</p>
          {currentPlan === 'free' ? (
            <span className="bg-gray-500 text-white py-2 px-4 rounded">契約中</span>
          ) : (
            <Link
              href="/purchase?plan=free"
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Select Free Plan
            </Link>
          )}
        </div>
        {/* Premium Plan */}
        <div className="border border-gray-300 rounded-lg p-6 w-1/2 text-center shadow-md">
          <h3 className="text-lg font-semibold mb-2">Premium Plan</h3>
          <p className="mb-4">
            Features: Access to all features including premium support.
          </p>
          {currentPlan === 'Premium' ? (
            <span className="bg-gray-500 text-white py-2 px-4 rounded">契約中</span>
          ) : (
            <Link
              href="https://buy.stripe.com/test_14kbK89cO31B13O5km"
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Purchase Premium Plan
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
