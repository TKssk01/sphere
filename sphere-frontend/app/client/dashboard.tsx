'use client';
import React, { useState, useEffect, useCallback } from 'react';
import SystemTradeSettingsComponent from './system-trade-setting';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/lib/database.types';

// Supabase クライアントの初期化
const supabase = createClientComponentClient<Database>();

// 型定義（必要に応じて更新）
interface Position {
  ExecutionID: string;
  AccountType: number;
  Symbol: string;
  SymbolName: string;
  Exchange: number;
  ExchangeName: string;
  ExecutionDay: number;
  Price: number;
  LeavesQty: number;
  HoldQty: number;
  Side: string;
  Expenses: number;
  Commission: number;
  CommissionTax: number;
  ExpireDay: number;
  MarginTradeType: number;
  CurrentPrice?: number;
  Valuation?: number;
  ProfitLoss?: number;
  ProfitLossRate?: number;
}

// ここでは、`name`, `aukabucom_api_password`, `aukabucom_login_password` を `string | null` に変更
interface User {
  id: string;
  email: string;
  name: string | null;
  plan_grade: string;
  aukabucom_api_password: string | null;
  aukabucom_login_password: string | null;
}

type SystemTradeSettings = {
  is_enabled: boolean;
  trade_volume: number;
  trade_volume_type: 'fixed' | 'percentage';
  max_loss: number;
  max_loss_type: 'fixed' | 'percentage';
  risk_tolerance: number;
};

const DashboardContent: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [purchaseStatus, setPurchaseStatus] = useState<string | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [systemTradeSettings, setSystemTradeSettings] = useState<SystemTradeSettings | null>(null);
  const [assetInfo, setAssetInfo] = useState<any>(null);
  const [assetLoading, setAssetLoading] = useState<boolean>(false);
  const [assetError, setAssetError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<any>(null);

  // ユーザーデータの状態変数
  const [userData, setUserData] = useState<User | null>(null);

  // ユーザーデータ取得処理
  const fetchUserData = async () => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        throw sessionError;
      }

      if (!session) {
        throw new Error('Not authenticated');
      }

      const { data, error } = await supabase
        .from('profiles') // 'users' ではなく 'profiles' を使用
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) {
        throw error;
      }

      setUserData(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUserData(null);
    }
  };

  useEffect(() => {
    // ページ読み込み時にユーザーデータを取得
    fetchUserData();
  }, []);


  // データ取得関数を分割
  const fetchPositions = async (token: string): Promise<Position[]> => {
    try {
      const response = await fetch('http://localhost:8000/api/positions', { headers: { 'Authorization': `Bearer ${token}` } });
      if (!response.ok) {
        throw new Error(`ポジション情報の取得に失敗しました: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('ポジション情報の取得中にエラーが発生しました:', error);
      return [];
    }
  };

  const fetchAssetInfo = async (token: string): Promise<any> => {
    try {
      const response = await fetch('http://localhost:8000/api/asset-info', { headers: { 'Authorization': `Bearer ${token}` } });
      if (!response.ok) {
        throw new Error(`資産情報の取得に失敗しました: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('資産情報の取得中にエラーが発生しました:', error);
      return null;
    }
  };

  const fetchAllData = useCallback(async (token: string) => {
    setIsLoading(true);
    setAssetError(null);

    try {
      const positions = await fetchPositions(token);
      const assetInfo = await fetchAssetInfo(token);

      setPositions(positions);
      setAssetInfo(assetInfo);
      setLastUpdated(new Date().toLocaleString());
    } catch (error) {
      console.error('データの取得に失敗しました:', error);
      setAssetError(error instanceof Error ? error.message : '不明なエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // トークンとデータを取得する useEffect
  useEffect(() => {
    const fetchTokenAndData = async () => {
      try {
        // 変更点: `aukabucom_api_password` を含めるために `userData` を確認
        if (!userData?.aukabucom_api_password) {
          throw new Error('API password not available');
        }

        // 変更点: `aukabucom_api_password` をリクエストボディに含める
        const response = await fetch('http://localhost:8000/api/get-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // 他の必要なヘッダー (例: 'X-User-ID')
          },
          body: JSON.stringify({ 
            APIPassword: userData.aukabucom_api_password 
          }),
        });
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }
        const data = await response.json();
        setToken(data.token);
        await fetchAllData(data.token);
      } catch (error) {
        console.error('Error fetching token:', error);
      }
    };

    // 変更点: `userData` が存在する場合にのみ `fetchTokenAndData` を実行
    if (userData?.aukabucom_api_password) {
      fetchTokenAndData();
    }
  }, [userData, fetchAllData]); // 変更点: `userData` を依存配列に追加



  const handleRefresh = useCallback(() => {
    if (token) {
      fetchAllData(token);
    }
  }, [token, fetchAllData]);

  const placeOrder = async (symbol: string, qty: number, aukabucom_login_password: string | null, aukabucom_api_password: string | null): Promise<void> => { // aukabucom_api_password を引数に追加
    if (!token) {
      setPurchaseStatus('認証トークンがありません。ログインしてください。');
      return;
    }
    try {
      const requestData = { 
        symbol, 
        qty, 
        aukabucom_login_password, // リクエストボディに追加
        aukabucom_api_password // リクエストボディに追加
      };
      const requestHeaders: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
  
      const response = await fetch('http://localhost:8000/api/purchase', {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify(requestData)
      });

        if (response.ok) {
            const data = await response.json();
            setPurchaseStatus(data.message);
        } else {
            const errorData = await response.json();
            setPurchaseStatus(errorData.detail || 'Purchase failed');
        }
    } catch (error) {
        console.error('Error during purchase:', error);
        setPurchaseStatus('Purchase failed');
    }
};



  // const handlePurchase = (): void => {
  //   placeOrder('6072', 100);
  // };

  const handleSystemTradeSettingsChange = (settings: any) => {
    setSystemTradeSettings(settings as SystemTradeSettings);
  };

  const formatCurrency = (value: number | null) => {
    if (value === null) return 'N/A';
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(value);
  };

  const handleSearch = async () => {
    if (!token) return;
    try {
      const response = await fetch(`http://localhost:8000/api/search?q=${searchQuery}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSearchResult(data);
        console.log(data);
      } else {
        console.error('銘柄検索に失敗しました:', response.status);
        setSearchResult(null);
      }
    } catch (error) {
      console.error('銘柄検索中にエラーが発生しました:', error);
      setSearchResult(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      {isLoading ? (
        <div className="flex items-center">
          <svg className="animate-spin h-5 w-5 mr-3 ..." xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          取得中です...
        </div>
      ) : assetError ? (
        <p className="text-red-500">取得できませんでした</p>
      ) : token ? (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">Token:</h2>
          <p className="font-mono bg-gray-100 p-2 rounded">{token}</p>
        </div>
      ) : (
        <p>Tokenがありません</p>
      )}

      <h2 className="text-2xl font-bold mb-4">Current Asset Information</h2>
      {assetLoading ? (
        <p className="text-gray-600">Loading asset information...</p>
      ) : assetError ? (
        <p className="text-red-500">Error: {assetError}</p>
      ) : assetInfo ? (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border-b md:border-b-0 md:border-r pb-2 md:pr-4">
              <p className="text-sm text-gray-600">Stock Account Wallet</p>
              <p className="text-lg font-semibold">{formatCurrency(assetInfo.stockAccountWallet)}</p>
            </div>
            <div className="border-b md:border-b-0 md:border-r pb-2 md:px-4">
              <p className="text-sm text-gray-600">Au KC Stock Account Wallet</p>
              <p className="text-lg font-semibold">{formatCurrency(assetInfo.auKCStockAccountWallet)}</p>
            </div>
            <div className="pb-2 md:pl-4">
              <p className="text-sm text-gray-600">Au Jbn Stock Account Wallet</p>
              <p className="text-lg font-semibold">{formatCurrency(assetInfo.auJbnStockAccountWallet)}</p>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-gray-600">No asset information available</p>
      )}

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-bold">Current Positions</h2>
          <button
            onClick={handleRefresh}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            disabled={isLoading}
          >
            {isLoading ? 'Updating...' : 'Refresh'}
          </button>
        </div>
        {lastUpdated && (
          <p className="text-sm text-gray-500 mb-2">Last updated: {lastUpdated}</p>
        )}
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Symbol</th>
              <th className="border p-2">Quantity</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Current Price</th>
              <th className="border p-2">Profit/Loss</th>
              <th className="border p-2">Profit/Loss Rate (%)</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((position) => (
              <tr
                key={position.ExecutionID}
                className={position.ExecutionID?.charCodeAt(0) % 2 === 0 ? 'bg-gray-100' : ''}
              >
                <td className="border p-2 text-right">{position.Symbol} ({position.SymbolName})</td>
                <td className="border p-2 text-right">{position.LeavesQty}</td>
                <td className="border p-2 text-right">{position.Price}</td>
                <td className="border p-2 text-right">{position.CurrentPrice}</td>
                <td className={`border p-2 text-right ${position.ProfitLoss && position.ProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {position.ProfitLoss}
                </td>
                <td className="border p-2 text-right">
                  {position.ProfitLossRate !== undefined ? `${position.ProfitLossRate.toFixed(2)}%` : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">銘柄検索</h2>
        <input
          type="text"
          placeholder="銘柄コードまたは会社名を入力"
          className="border rounded p-2 w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
          disabled={!searchQuery}
        >
          検索
        </button>
      </div>

      {searchResult && (
        <div className="mt-4">
          <h3 className="text-xl font-bold">検索結果</h3>
          <p>銘柄コード: {searchResult.Symbol}</p>
          <p>会社名: {searchResult.SymbolName}</p>
          <p>現在価格: {searchResult.CurrentPrice ? searchResult.CurrentPrice : searchResult.CalcPrice}</p>
          <button
            onClick={() => {
              if (userData) { // userDataがnullでないことを確認
                placeOrder(searchResult.Symbol, 100, userData.aukabucom_login_password , userData.aukabucom_api_password);
              } else {
                // userDataがnullの場合の処理 (例: エラーメッセージを表示)
                console.error("ユーザーデータが取得できていません。");
              }
            }}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2"
          >
            100株購入
          </button>
        </div>
      )}

      {/* <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={handlePurchase}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          地盤HDを100株注文
        </button>
        <button
          onClick={() => placeOrder('7021', 100)}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          三菱重工 100株
        </button>
      </div> */}

      {purchaseStatus === "Order successful" && (
        <div className="mt-6 text-green-500 font-bold">
          <p>注文完了</p>
        </div>
      )}
      {purchaseStatus && purchaseStatus !== "Order successful" && (
        <div className="mt-6 text-red-500 font-bold">
          <h2 className="text-xl font-bold mb-2">Purchase Status:</h2>
          <p>{purchaseStatus}</p>
        </div>
      )}

      {/* <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">System Trade Settings</h2>
        <SystemTradeSettingsComponent
          onSettingsChange={handleSystemTradeSettingsChange}
          token={token}
        />
      </div>

      {systemTradeSettings && (
        <div className="mt-4">
          <h3 className="text-xl font-bold">Current System Trade Settings:</h3>
          <pre className="bg-gray-100 p-4 rounded mt-2">
            {JSON.stringify(systemTradeSettings, null, 2)}
          </pre>
        </div>
      )} */}
      {/* ユーザーデータを表示 */}
      {userData === null ? ( 
        <p>Loading user data...</p> // userDataがnull（まだ取得されていない）場合はローディング表示
      ) : userData ? ( 
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">ユーザープロフィール</h2>
          <p>ID: {userData.id}</p>
          <p>Email: {userData.email}</p>
          <p>Name: {userData.name}</p>
          <p>Plan Grade: {userData.plan_grade}</p>
          <p>aukabucom_api_password: {userData.aukabucom_api_password}</p>
          <p>aukabucom_login_password: {userData.aukabucom_login_password}</p>
          {/* 他のカラムも同様に表示 */}
        </div>
      ) : (
        <p className="text-red-500">Error loading user data.</p> // userDataがnull以外（エラー）の場合はエラー表示
      )}
    </div>
  );
};

export default DashboardContent;