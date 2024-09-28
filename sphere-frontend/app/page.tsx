"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Globe, BarChart2, DollarSign, Menu } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function SphereHomepage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-600 text-white">
      <header className="bg-blue-800 bg-opacity-50 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Globe className="w-8 h-8 text-blue-300" />
            <h1 className="text-2xl font-bold">Sphere</h1>
          </div>
          <nav className="hidden md:block">
            <ul className="flex space-x-6">
              {/* <li><Link href="/dashboard" className="hover:text-blue-300 transition-colors">Dashboard</Link></li> */}
              {/* <li><Link href="/markets" className="hover:text-blue-300 transition-colors">Markets</Link></li>
              <li><Link href="/account" className="hover:text-blue-300 transition-colors">Account</Link></li> */}
            </ul>
          </nav>
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>
      {isMenuOpen && (
        <div className="md:hidden bg-blue-800 bg-opacity-90 backdrop-blur-md">
          <nav className="container mx-auto px-4 py-4">
            <ul className="space-y-2">
              <li><Link href="/dashboard" className="block hover:text-blue-300 transition-colors">Dashboard</Link></li>
              {/* <li><Link href="/markets" className="block hover:text-blue-300 transition-colors">Markets</Link></li>
              <li><Link href="/account" className="block hover:text-blue-300 transition-colors">Account</Link></li> */}
            </ul>
          </nav>
        </div>
      )}
      <main className="container mx-auto px-4 py-8 flex flex-col items-center">
        <div className="w-64 h-64 md:w-96 md:h-96 relative mb-8">
          <svg viewBox="0 0 200 200" className="w-full h-full" aria-label="Stylized globe representing Sphere's global financial network">
            <defs>
              <linearGradient id="globe-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4299E1" />
                <stop offset="100%" stopColor="#2B6CB0" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <circle cx="100" cy="100" r="95" fill="url(#globe-gradient)" />
            <g filter="url(#glow)">
              <path d="M100,5 A95,95 0 0,1 100,195 A95,95 0 0,1 100,5 Z" fill="none" stroke="#63B3ED" strokeWidth="0.5" />
              <path d="M5,100 A95,95 0 0,1 195,100 A95,95 0 0,1 5,100 Z" fill="none" stroke="#63B3ED" strokeWidth="0.5" />
              <path d="M30,70 Q100,10 170,70 T170,130 Q100,190 30,130 T30,70" fill="none" stroke="#90CDF4" strokeWidth="0.5" />
            </g>
            <g className="text-start fill-current">
              <text x="95" y="40" textAnchor="end">NYC</text>
              <text x="140" y="70">Tokyo</text>
              <text x="20" y="150">London</text>
              <text x="140" y="160">Sydney</text>
            </g>
            <g fill="#FCD34D">
              <circle cx="105" cy="35" r="2" />
              <circle cx="165" cy="65" r="2" />
              <circle cx="45" cy="125" r="2" />
              <circle cx="145" cy="155" r="2" />
            </g>
            <g className="text-xs fill-current">
              <text x="100" y="110" textAnchor="middle" className="text-lg font-bold">Sphere</text>
              <text x="100" y="125" textAnchor="middle">Global Network</text>
            </g>
          </svg>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Global Financial Insights</h2>
        <p className="text-xl mb-8 text-center max-w-2xl">
          Explore worldwide market trends and make informed decisions with Sphere advanced trading system.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
          <div className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur-md flex flex-col items-center">
            <BarChart2 className="w-12 h-12 mb-4 text-blue-300" />
            <h3 className="text-xl font-semibold mb-2">Performance</h3>
            <p className="text-3xl font-bold">+8.5%</p>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur-md flex flex-col items-center">
            <Globe className="w-12 h-12 mb-4 text-blue-300" />
            <h3 className="text-xl font-semibold mb-2">Markets</h3>
            <p className="text-3xl font-bold">20+</p>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur-md flex flex-col items-center">
            <DollarSign className="w-12 h-12 mb-4 text-blue-300" />
            <h3 className="text-xl font-semibold mb-2">Total Value</h3>
            <p className="text-3xl font-bold">$1.5M</p>
          </div>
        </div>
      </main>
      <footer className="bg-blue-800 bg-opacity-50 backdrop-blur-md mt-8">
        <div className="container mx-auto px-4 py-4 text-center text-sm">
          &copy; 2024 Sphere Global Trading. All rights reserved.
        </div>
      </footer>
    </div>
  )
}


// return (
//   <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-600 text-white fixed top-10 left-0 bottom-3 w-screen h-screen z-50">
    
//     {isMenuOpen && (
//       <div className="md:hidden bg-blue-800 bg-opacity-90 backdrop-blur-md">
//         <nav className="container mx-auto px-4 py-4">
//           <ul className="space-y-2">
//             <li><Link href="/dashboard" className="block hover:text-blue-300 transition-colors">Dashboard</Link></li>
//             <li><Link href="/markets" className="block hover:text-blue-300 transition-colors">Markets</Link></li>
//             <li><Link href="/account" className="block hover:text-blue-300 transition-colors">Account</Link></li>
//           </ul>
//         </nav>
//       </div>
//     )}
//     <main className="container mx-auto px-4 py-8 flex flex-col items-center">
//       <div className="w-64 h-64 md:w-96 md:h-96 relative mb-8">
//         <svg viewBox="0 0 200 200" className="w-full h-full" aria-label="Stylized globe representing Sphere's global financial network">
//           <defs>
//             <linearGradient id="globe-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
//               <stop offset="0%" stopColor="#4299E1" />
//               <stop offset="100%" stopColor="#2B6CB0" />
//             </linearGradient>
//             <filter id="glow">
//               <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
//               <feMerge>
//                 <feMergeNode in="coloredBlur" />
//                 <feMergeNode in="SourceGraphic" />
//               </feMerge>
//             </filter>
//           </defs>
//           <circle cx="100" cy="100" r="95" fill="url(#globe-gradient)" />
//           <g filter="url(#glow)">
//             <path d="M100,5 A95,95 0 0,1 100,195 A95,95 0 0,1 100,5 Z" fill="none" stroke="#63B3ED" strokeWidth="0.5" />
//             <path d="M5,100 A95,95 0 0,1 195,100 A95,95 0 0,1 5,100 Z" fill="none" stroke="#63B3ED" strokeWidth="0.5" />
//             <path d="M30,70 Q100,10 170,70 T170,130 Q100,190 30,130 T30,70" fill="none" stroke="#90CDF4" strokeWidth="0.5" />
//           </g>
//           <g className="text-start fill-current">
//             <text x="95" y="40" textAnchor="end">NYC</text>
//             <text x="140" y="70">Tokyo</text>
//             <text x="20" y="150">London</text>
//             <text x="140" y="160">Sydney</text>
//           </g>
//           <g fill="#FCD34D">
//             <circle cx="105" cy="35" r="2" />
//             <circle cx="165" cy="65" r="2" />
//             <circle cx="45" cy="125" r="2" />
//             <circle cx="145" cy="155" r="2" />
//           </g>
//           <g className="text-xs fill-current">
//             <text x="100" y="110" textAnchor="middle" className="text-lg font-bold">Sphere</text>
//             <text x="100" y="125" textAnchor="middle">Global Network</text>
//           </g>
//         </svg>
//       </div>
//       <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Global Financial Insights</h2>
//       <p className="text-xl mb-8 text-center max-w-2xl">
//         Explore worldwide market trends and make informed decisions with Sphere advanced trading system.
//       </p>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
//         <div className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur-md flex flex-col items-center">
//           <BarChart2 className="w-12 h-12 mb-4 text-blue-300" />
//           <h3 className="text-xl font-semibold mb-2">Performance</h3>
//           <p className="text-3xl font-bold">+8.5%</p>
//         </div>
//         <div className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur-md flex flex-col items-center">
//           <Globe className="w-12 h-12 mb-4 text-blue-300" />
//           <h3 className="text-xl font-semibold mb-2">Markets</h3>
//           <p className="text-3xl font-bold">20+</p>
//         </div>
//         <div className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur-md flex flex-col items-center">
//           <DollarSign className="w-12 h-12 mb-4 text-blue-300" />
//           <h3 className="text-xl font-semibold mb-2">Total Value</h3>
//           <p className="text-3xl font-bold">$1.5M</p>
//         </div>
//       </div>
//     </main>
//   </div>
// )
// }


// import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
// import { cookies } from 'next/headers'
// import Link from 'next/link'

// import type { Database } from '@/lib/database.types'

// // ホームページ
// const Home = async () => {
//   const supabase = createServerComponentClient<Database>({
//     cookies,
//   })

//   // セッションの取得
//   const {
//     data: { session },
//   } = await supabase.auth.getSession()

//   const { data: profile } = await supabase
//   .from('profiles')
//   .select('aukabucom_api_password')
//   .eq('id', session?.user.id ? session.user.id : '')
//   .single()

//   // プロファイルデータからaukabucom_api_passwordを取得
//   const aukabucomApiPassword = profile?.aukabucom_api_password
  
//   console.log(session);
//   console.log(aukabucomApiPassword);

//   return (
//     <div className="text-center">
//       <h1 className="text-4xl font-bold mb-8">Sphere System</h1>
//       {session ? (
//         <div>
          
//           <p className="text-xl mb-4">ようこそ、{session.user.email} さん</p>
//           <p className="text-xl mb-4">APIパスワード: {aukabucomApiPassword}</p>
//           <Link href="/dashboard" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
//             ダッシュボードへ
//           </Link>
//         </div>
//       ) : (
//         <div>
//           <p className="text-xl mb-4">ログインしていません</p>
//           <div className="flex flex-col space-y-4">
//             <Link href="/auth/login" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-1 rounded w-full">
//               Login
//             </Link>
//             <Link href="/auth/signup" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-2 rounded inline-block">
//               SignUp
//             </Link>
//             <Link href="/auth/google" className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2 rounded inline-block">
//               Google認証でLogin
//             </Link>
//           </div>
//         </div>
//       )}
//     </div>  
//   )
// }

// export default Home