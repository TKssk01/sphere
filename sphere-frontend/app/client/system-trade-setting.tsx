import React, { useState, useEffect, useCallback} from 'react';

interface SystemTradeSettings {
  isEnabled: boolean;
  tradeVolume: number;
  tradeVolumeType: 'fixed' | 'percentage';
  maxLoss: number;
  maxLossType: 'fixed' | 'percentage';
  riskTolerance: number;
  selectedAlgorithm: string;
}

interface SystemTradeSettingsProps {
  token: string | null;
  onSettingsChange: (settings: SystemTradeSettings) => void;
}

const SystemTradeSettingsComponent: React.FC<SystemTradeSettingsProps> = ({ token, onSettingsChange }) => {
  const [settings, setSettings] = useState<SystemTradeSettings>({
    isEnabled: false,
    tradeVolume: 0,
    tradeVolumeType: 'fixed',
    maxLoss: 0,
    maxLossType: 'fixed',
    riskTolerance: 5,
    selectedAlgorithm: 'algorithm1'
  });

  

  const fetchSettings = useCallback(async () => {
    if (!token) return;

    try {
      const response = await fetch('http://localhost:8000/api/system-trade-settings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchSettings();
    }
  }, [token, fetchSettings]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/system-trade-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });
      if (response.ok) {
        onSettingsChange(settings);
        alert('Settings updated successfully');
      }
    } catch (error) {
      console.error('Failed to update settings:', error);
      alert('Failed to update settings');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="flex items-center">
             システムトレードを有効にする(Enable System Trade)
        </label>
        </div>

        {/* ボタンの表示 */}
        <div className="mt-4">
            <button
                className={`px-4 py-2 rounded text-white ${settings.isEnabled ? 'bg-red-600' : 'bg-blue-600'}`}
                onClick={() => {
                // トレードの有効/無効を切り替える
                const newValue = !settings.isEnabled;
                setSettings(prev => ({
                    ...prev,
                    isEnabled: newValue, // 新しい値を設定
                }));
                }}
            >
                {settings.isEnabled ? '実行中 (Running)' : '停止中 (Stopped)'}
            </button>
        </div>
      <div>
        <label className="block">取引量(Trade Volume)</label>
        <input
          type="number"
          name="tradeVolume"
          value={settings.tradeVolume}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
        <select
          name="tradeVolumeType"
          value={settings.tradeVolumeType}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        >
          <option value="fixed">固定量(Fixed Amount)</option>
          <option value="percentage">総資産の割合(Percentage of Total Assets)</option>
        </select>
      </div>

      <div>
        <label className="block">最大損失(Max Loss)</label>
        <input
          type="number"
          name="maxLoss"
          value={settings.maxLoss}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
        <select
          name="maxLossType"
          value={settings.maxLossType}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        >
          <option value="fixed">固定量(Fixed Amount)</option>
          <option value="percentage">総資産の割合(Percentage of Total Assets)</option>
        </select>
      </div>

      <div>
        <label className="block">リスク許容度(Risk Tolerance (1-10))</label>
        <input
          type="range"
          name="riskTolerance"
          min="1"
          max="10"
          value={settings.riskTolerance}
          onChange={handleInputChange}
          className="mt-1 block w-full"
        />
        <span>{settings.riskTolerance}</span>
      </div>

      <div>
        <label className="block">Algorithm</label>
        <select
          name="selectedAlgorithm"
          value={settings.selectedAlgorithm}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        >
          <option value="algorithm1">Algorithm 1</option>
          <option value="algorithm2">Algorithm 2</option>
          <option value="algorithm3">Algorithm 3</option>
        </select>
      </div>

      <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Save Settings
      </button>
    </form>
  );
};

export default SystemTradeSettingsComponent;