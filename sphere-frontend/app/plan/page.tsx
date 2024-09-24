"use client";

import { SessionProvider } from 'next-auth/react';
import PlanPage from '../components/PlanPage';

export default function Home() {
  return (
    <div>
      <PlanPage />
    </div>
  );
}