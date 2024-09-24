import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { supabase } from '@/lib/supabaseClient';

const getPlan = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (!session.user) {
    return res.status(401).json({ message: 'User not found' });
  }

  const { data, error } = await supabase
    .from('users')
    .select('plan')
    .eq('email', session.user.email)
    .single();

  if (error) {
    return res.status(500).json({ message: 'Error fetching plan', error });
  }

  res.status(200).json({ plan: data.plan });
};

// 関数を変数に代入してからエクスポート
export default getPlan;