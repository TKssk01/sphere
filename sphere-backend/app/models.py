from pydantic import BaseModel, Field
from enum import Enum

class TradeVolumeType(str, Enum):
    FIXED = "fixed"
    PERCENTAGE = "percentage"

class AlgorithmType(str, Enum):
    ALGO1 = "algorithm1"
    ALGO2 = "algorithm2"
    ALGO3 = "algorithm3"

class SystemTradeSettings(BaseModel):
    is_enabled: bool = Field(..., description="システムトレードのオン/オフ")
    trade_volume: float = Field(..., description="取引量")
    trade_volume_type: TradeVolumeType = Field(..., description="取引量のタイプ（固定額または割合）")
    max_loss: float = Field(..., description="最大損失額")
    max_loss_type: TradeVolumeType = Field(..., description="最大損失額のタイプ（固定額または割合）")
    risk_tolerance: int = Field(..., ge=1, le=10, description="リスク許容度（1-10のスケール）")
    selected_algorithm: AlgorithmType = Field(..., description="選択されたアルゴリズム")

class Product(str, Enum):
    ALL = "0"
    SPOT = "1"
    MARGIN = "2"
    FUTURES = "3"
    OPTION = "4"

class Side(str, Enum):
    SELL = "1"
    BUY = "2"

class User(BaseModel):
    id: str
    email: str
    name: str
    api_password: str
    execution_password: str

# 必要に応じて他のモデルを追加
