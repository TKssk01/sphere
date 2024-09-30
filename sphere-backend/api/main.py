import os
import json
import logging
import urllib.request
import requests
from fastapi import FastAPI, HTTPException, Request, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from enum import Enum
from typing import Optional
from supabase import create_client, Client
from dotenv import load_dotenv
import os
import logging
import asyncio


# ロガーを取得
logger = logging.getLogger("uvicorn.access")

# ログレベルをDEBUGに設定
logger.setLevel(logging.DEBUG)

# ハンドラーを追加 (必要に応じて)
handler = logging.StreamHandler()
handler.setFormatter(logging.Formatter("%(asctime)s - %(levelname)s - %(message)s"))
logger.addHandler(handler)

ENV = os.getenv("ENV", "development")  # 環境変数 "ENV" を使用

if ENV == "production":
    load_dotenv(".env.production")
else:
    load_dotenv(".env.development")

# .envファイルをロード（ローカル開発用）
# load_dotenv()

app = FastAPI()
security = HTTPBearer()

# Supabase クライアントの初期化
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(supabase_url, supabase_key)

# APIエンドポイントとOrder URLを環境変数から取得
API_ENDPOINT = os.getenv("API_ENDPOINT")
ORDER_URL = os.getenv("ORDER_URL")

# ログ設定
logging.basicConfig(
    filename="app.log",  # サーバーレス環境ではログはVercelのダッシュボードで確認可能
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
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
origins = [
    "https://www.sphere-trade.cloud/",  # フロントエンドのURL
    "http://localhost:3000",             # ローカル開発時のフロントエンドURL（必要に応じて）
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # 許可するオリジンを指定
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
def get_kabu_api_token(api_password: str) -> Optional[str]:
    obj = {'APIPassword': api_password}
    json_data = json.dumps(obj).encode('utf8')
    
    url = f"{API_ENDPOINT}/token"
    req = urllib.request.Request(url, json_data, method='POST')
    req.add_header('Content-Type', 'application/json')

    try:
        with urllib.request.urlopen(req) as res:
            content = json.loads(res.read())
            return content["Token"]
    except urllib.error.HTTPError as e:
        logging.error(f"Kabu Plus API Error: {e}")
        return None
    except Exception as e:
        logging.error(f"Unexpected Error: {e}")
        return None

async def get_credentials():
    try:
        response = supabase.table("profiles").select("*").execute()
        data = response['data']
        # デバッグ情報を出力
        logging.debug(f"Response from Supabase: {data}")

        # デバッグ情報を別のスレッドで出力
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(None, print, f"Response from Supabase: {data}") 
        if len(data) < 2:
            raise HTTPException(status_code=500, detail="Insufficient profiles data")
        api_password = data[0]['aukabucom_api_password']
        print(api_password)
        execution_password = data[1]['aukabucom_login_password']
        return api_password, execution_password
    except Exception as e:
        logging.error(f"Error fetching credentials from Supabase: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch credentials from Supabase")

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

@app.post('/api/positions')
async def get_positions(
    request: Request,  # リクエストオブジェクトを追加
    product: Optional[Product] = None,
    symbol: Optional[str] = None,
    side: Optional[Side] = None,
    addinfo: Optional[bool] = True
):
    try:
        body = await request.json()  # リクエストボディを取得
        api_password = body.get("APIPassword")
        if not api_password:
            raise HTTPException(status_code=400, detail="APIPassword is required")

        token = get_kabu_api_token(api_password)
        if not token:
            raise HTTPException(status_code=500, detail="Failed to obtain API token")

        url = f"{API_ENDPOINT}/positions"
        
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

@app.post('/api/asset-info')
async def get_asset_info(request: Request):
    try:
        body = await request.json()
        api_password = body.get("APIPassword")
        if not api_password:
            raise HTTPException(status_code=400, detail="APIPassword is required")

        token = get_kabu_api_token(api_password)
        if not token:
            raise HTTPException(status_code=500, detail="Failed to obtain API token")

        response = requests.get(f"{API_ENDPOINT}/wallet/cash", headers={
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
        logging.error(f"Failed to fetch asset information: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch asset information: {str(e)}")


@app.post("/api/search")
async def search_by_company_name(request: Request):
    try:
        body = await request.json()
        api_password = body.get("APIPassword")
        q = body.get("symbol")
        if not api_password:
            raise HTTPException(status_code=400, detail="APIPassword is required")
        if not q:
            raise HTTPException(status_code=400, detail="Symbol is required")

        token = get_kabu_api_token(api_password)
        if not token:
            raise HTTPException(status_code=500, detail="Failed to obtain API token")

        headers = {'X-API-KEY': token}
        market_code = "1"  # 東証

        response = requests.get(f"{API_ENDPOINT}/board/{q}@{market_code}", headers=headers)
        response.raise_for_status()
        board_info = response.json()

        result = {
            "Symbol": board_info.get("Symbol"),
            "SymbolName": board_info.get("SymbolName"),
            "Exchange": board_info.get("Exchange"),
            "ExchangeName": board_info.get("ExchangeName"),
            "CurrentPrice": board_info.get("CurrentPrice"),
            "CalcPrice": board_info.get("CalcPrice"),
        }

        return result

    except requests.HTTPError as e:
        logging.error(f"HTTPエラー: {e.response.status_code} - {e.response.text}")
        raise HTTPException(status_code=e.response.status_code, detail=f"Kabu Station APIエラー: {e.response.text}")
    except Exception as e:
        logging.error(f"予期しないエラーが発生しました: {e}")
        raise HTTPException(status_code=500, detail=f"予期しないエラーが発生しました: {str(e)}")    
    




@app.post("/api/purchase")
async def purchase(request_data: dict = Body(...)):
    try:
        symbol = request_data.get("symbol")
        qty = request_data.get("qty")
        aukabucom_login_password = request_data.get("aukabucom_login_password")
        aukabucom_api_password = request_data.get("aukabucom_api_password")

        logging.info(f"Received purchase request: symbol={symbol}, qty={qty}, aukabucom_login_password={aukabucom_login_password}")

        result = place_buy_order(symbol, qty, aukabucom_login_password, aukabucom_api_password)
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
    token = get_kabu_api_token(aukabucom_api_password)
    ORDER_URL = os.getenv("ORDER_URL")
    
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

# サーバーレス環境用ハンドラー
from mangum import Mangum
handler = Mangum(app)
