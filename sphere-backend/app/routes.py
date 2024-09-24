from fastapi import APIRouter, Depends, HTTPException, Body
from typing import Optional
import requests
import urllib.request
import json
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from enum import Enum
from supabase import create_client, Client
from dotenv import load_dotenv
import os

from . import services, utils
from .models import SystemTradeSettings, Product, Side
from .utils import get_user_credentials
from .config import API_ENDPOINT
from .auth import get_current_user  # ユーザー認証用の依存関係

load_dotenv()

API_ENDPOINT = os.environ.get('API_ENDPOINT')

router = APIRouter()

# Pingエンドポイント
@router.get("/api/ping")
async def ping():
    return {"message": "Pong"}

# トークン取得エンドポイント
@router.get("/api/get-token")
async def get_token():
    # 認証なしでトークンを取得
    api_password = os.environ.get('API_PASSWORD')
    token = fetch_token_from_aukabucm(api_password)
    if token is None:
        raise HTTPException(status_code=500, detail="Failed to get token")
    return {"token": token}


# 購入エンドポイント
@router.post("/api/purchase")
async def purchase(
    request_data: dict = Body(...),
    current_user=Depends(get_current_user)
):
    try:
        # ユーザーのパスワードを取得
        api_password, execution_password = await get_user_credentials(current_user.id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    symbol = request_data.get("symbol")
    qty = request_data.get("qty")

    # 購入注文を実行
    result = services.place_buy_order(symbol, qty, api_password, execution_password)
    if result is None:
        raise HTTPException(status_code=500, detail="Failed to place buy order.")
    elif "Code" in result and result["Code"] != 0:
        error_message = result.get("Message", "Unknown error occurred during order placement.")
        raise HTTPException(status_code=500, detail=f"Failed to place buy order: {error_message}")
    else:
        order_id = result.get("OrderId")
        return {"message": "Order successful", "order_id": order_id}

# ポジション取得エンドポイント
@router.get('/api/positions')
async def get_positions(
    product: Optional[Product] = None,
    symbol: Optional[str] = None,
    side: Optional[Side] = None,
    addinfo: Optional[bool] = True,
    current_user=Depends(get_current_user)
):
    try:
        api_password, _ = await get_user_credentials(current_user.id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    token = services.get_kabu_api_token(api_password)
    positions = services.get_positions_from_kabustation(
        token, product=product, symbol=symbol, side=side, addinfo=addinfo
    )
    if positions is None:
        raise HTTPException(status_code=500, detail="Failed to fetch positions")
    return positions

# 資産情報取得エンドポイント
@router.get('/api/asset-info')
async def get_asset_info(current_user=Depends(get_current_user)):
    try:
        api_password, _ = await get_user_credentials(current_user.id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    token = services.get_kabu_api_token(api_password)
    asset_info = services.get_asset_info(token)
    if asset_info is None:
        raise HTTPException(status_code=500, detail="Failed to fetch asset information")
    return asset_info

@router.get("/api/check-api-access")
async def check_api_access():
    # APIアクセス可能かどうかを判定するロジックを実装
    accessible = True
    return {"accessible": accessible}

# ユーティリティ関数
def fetch_token_from_aukabucm(api_password):
    url = f"{API_ENDPOINT}/token"
    obj = {'APIPassword': api_password}
    json_data = json.dumps(obj).encode('utf8')
    req = urllib.request.Request(url, data=json_data, method='POST')
    req.add_header('Content-Type', 'application/json')

    try:
        with urllib.request.urlopen(req) as res:
            content = json.loads(res.read())
            return content.get('Token')
    except urllib.error.HTTPError as e:
        error_content = e.read().decode('utf-8')
        print(f"Failed to get token: {e}, Response: {error_content}")
        return None
    except Exception as e:
        print(f"Failed to get token: {e}")
        return None