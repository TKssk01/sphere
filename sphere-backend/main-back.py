import requests
import urllib.request
import json
import logging
import httpx
from fastapi import FastAPI, HTTPException, APIRouter, Depends, Query , Header, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, Field
from enum import Enum
from typing import Optional
from fastapi import Request
from supabase import create_client, Client
from fastapi import FastAPI, Depends, HTTPException
from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import Tuple, Optional, Dict
import os
import json
import urllib.request

app = FastAPI()
security = HTTPBearer()

# Supabase クライアントの初期化
supabase_url = "https://xgeffionfgacuptwibnp.supabase.co"
supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhnZWZmaW9uZmdhY3VwdHdpYm5wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjUwNjY5ODUsImV4cCI6MjA0MDY0Mjk4NX0.ZRo1LrL8qThTAvCC-_C6ol7txd77IeENlMdMLp3kVZM"
supabase: Client = create_client(supabase_url, supabase_key)
# Supabase からデータを取得
response = supabase.table("profiles").select("*").execute()
data = response['data']

API_ENDPOINT = "http://localhost:18080/kabusapi"
API_PASSWORD = data[1]['aukabucom_api_password']
EXECUTION_PASSWORD = data[1]['aukabucom_login_password']
ORDER_URL = 'http://localhost:18080/kabusapi/sendorder'



# ログ設定
logging.basicConfig(
    filename="app.log",  # ログファイル名
    level=logging.INFO,  # ログレベル
    format="%(asctime)s - %(levelname)s - %(message)s",  # ログフォーマット
)


class Product(str, Enum):
    ALL = "0"
    SPOT = "1"
    MARGIN = "2"
    FUTURES = "3"
    OPTION = "4"
class Side(str, Enum):
    SELL = "1"
    BUY = "2"

# CORSミドルウェアを追加
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # すべてのオリジンを許可
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



def get_kabu_api_token(api_password: str) -> Optional[str]:
    obj = {'APIPassword': api_password}
    json_data = json.dumps(obj).encode('utf8')
    
    url = "http://localhost:18080/kabusapi/token"
    req = urllib.request.Request(url, json_data, method='POST')
    req.add_header('Content-Type', 'application/json')

    try:
        with urllib.request.urlopen(req) as res:
            content = json.loads(res.read())
            return content["Token"]
    except urllib.error.HTTPError as e:
        print(f"Kabu Plus API Error: {e}")
        return None
    except Exception as e:
        print(f"Unexpected Error: {e}")
        return None

@app.post("/api/get-token")
async def get_token_api(request: Request):
    try:
        body = await request.json()
        api_password = body.get("APIPassword")
        if not api_password:
            raise HTTPException(status_code=400, detail="APIPassword is required")

        token = get_kabu_api_token(api_password)
        if token is None:
            raise HTTPException(status_code=500, detail="Failed to get token from Kabu Plus API")

        return {"token": token}
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON in request body")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")



        
@app.get('/api/positions')
async def get_positions(
    product: Optional[Product] = None,
    symbol: Optional[str] = None,
    side: Optional[Side] = None,
    addinfo: Optional[bool] = True
):
    try:
        token = get_kabu_api_token(API_PASSWORD)  # 修正済み
        url = "http://localhost:18080/kabusapi/positions"
        
        params = {}
        if product:
            params["product"] = product
        if symbol:
            params["symbol"] = symbol
        if side:
            params["side"] = side
        if addinfo is not None:
            params["addinfo"] = str(addinfo).lower()
        
        response = requests.get(url, headers={
            'X-API-KEY': token,
            'Content-Type': 'application/json'
        }, params=params)
        response.raise_for_status()
        positions = response.json()
        
        logging.info(f"Successfully fetched {len(positions)} positions")
        return positions
    except requests.RequestException as e:
        logging.error(f"Error fetching positions from kabustation: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to fetch positions: {str(e)}")



@app.get('/api/asset-info')
async def get_asset_info():
    try:
        token = get_kabu_api_token(API_PASSWORD)  # 修正済み
        response = requests.get('http://localhost:18080/kabusapi/wallet/cash', headers={
            'X-API-KEY': token
        })
        response.raise_for_status()
        data = response.json()
        
        return {
            'stockAccountWallet': data.get('StockAccountWallet'),
            'auKCStockAccountWallet': data.get('AuKCStockAccountWallet'),
            'auJbnStockAccountWallet': data.get('AuJbnStockAccountWallet')
        }
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch asset information: {str(e)}")


@app.get("/api/dashboard-data")
async def get_dashboard_data():
    try:
        token = get_kabu_api_token()
        positions = await get_positions(token)
        asset_info = await get_asset_info()
        server_accessible = True
        api_accessible = True
        
        data = {
            "positions": positions,
            "asset_info": asset_info,
            "server_accessible": server_accessible,
            "api_accessible": api_accessible
        }
        return data
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")

@app.get("/api/search")
async def search_by_company_name(q: str):
    token = get_kabu_api_token(API_PASSWORD)  # 修正：API_PASSWORDを渡す
    
    if token is None:
        raise HTTPException(status_code=500, detail="Failed to obtain API token.")
    
    try:
        headers = {'X-API-KEY': token}
        market_code = "1"  # 東証
        
        response = requests.get(f"http://localhost:18080/kabusapi/board/{q}@{market_code}", headers=headers)
        response.raise_for_status()
        board_info = response.json()

        response = requests.get(f"http://localhost:18080/kabusapi/symbol/{q}@{market_code}", headers=headers)
        response.raise_for_status()
        symbol_info = response.json()

        result = {**board_info, **symbol_info}
        return result

    except requests.exceptions.HTTPError as e:
        logging.error(f"HTTP Error: {e.response.status_code} - {e.response.text}")
        raise HTTPException(status_code=e.response.status_code, detail=f"Kabu Station API Error: {e.response.text}")
    except requests.exceptions.RequestException as e:
        logging.error(f"Request Exception: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to search: {str(e)}")



@app.post("/api/purchase")
async def purchase(request_data: dict = Body(...)):
    symbol = request_data.get("symbol")
    qty = request_data.get("qty")
    aukabucom_login_password = request_data.get("aukabucom_login_password") # 追加
    aukabucom_api_password = request_data.get("aukabucom_api_password") 

    logging.info(f"Received purchase request: symbol={symbol}, qty={qty}, aukabucom_login_password={aukabucom_login_password}")

    try:
        result = place_buy_order(symbol, qty, aukabucom_login_password, aukabucom_api_password) # 渡す
        if result is None:
            raise HTTPException(status_code=500, detail="Failed to place buy order. Please check Kabu Station API logs.")
        elif "Code" in result and result["Code"] != 0:
            error_message = result.get("Message", "Unknown error occurred during order placement.")
            raise HTTPException(status_code=500, detail=f"Failed to place buy order: {error_message}")
        else:
            order_id = result.get("OrderId")
            logging.info(f"Order placed successfully. Order ID: {order_id}")
            return {"message": "Order successful", "order_id": order_id}
    except Exception as e:
        logging.error(f"Unexpected error during purchase: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="An unexpected error occurred during purchase.")

def place_buy_order(symbol, qty, aukabucom_login_password, aukabucom_api_password):
    obj = {
        'Password': aukabucom_login_password,
        'Symbol': symbol,
        'Exchange': 1,
        'SecurityType': 1,
        'Side': '2',
        'CashMargin': 1,
        'DelivType': 2,
        'FundType': 'AA',
        'AccountType': 2,
        'Qty': qty,
        'FrontOrderType': 10,
        'Price': 0,
        'ExpireDay': 0
    }

    json_data = json.dumps(obj).encode('utf-8')
    token = get_kabu_api_token(aukabucom_api_password) # 渡す
    ORDER_URL = 'http://localhost:18080/kabusapi/sendorder'


    req = urllib.request.Request(ORDER_URL, json_data, method='POST')
    req.add_header('Content-Type', 'application/json')
    req.add_header('X-API-KEY', token)

    try:
        with urllib.request.urlopen(req) as res:
            content = json.loads(res.read())
            return content
    except urllib.error.HTTPError as e:
        logging.error(f"HTTP Error: {e}")
        error_content = json.loads(e.read())
        logging.error(error_content)
        return error_content
    except Exception as e:
        logging.exception(f"Unexpected Error: {e}")
        return None


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)