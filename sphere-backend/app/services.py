import requests
import json
import logging
from . import config
from supabase import create_client, Client
from .models import User
from typing import Optional

# Supabase クライアントの初期化
supabase: Client = create_client(config.SUPABASE_URL, config.SUPABASE_KEY)

def get_kabu_api_token(api_password: str) -> Optional[str]:
    url = f"{config.API_ENDPOINT}/token"
    obj = {'APIPassword': api_password}
    try:
        response = requests.post(url, json=obj)
        if response.status_code == 200:
            return response.json().get('Token')
        else:
            logging.error(f"Failed to get token: {response.text}")
            return None
    except Exception as e:
        logging.error(f"Exception in get_kabu_api_token: {str(e)}")
        return None

def place_buy_order(symbol: str, qty: int, api_password: str, execution_password: str) -> Optional[dict]:
    token = get_kabu_api_token(api_password)
    if not token:
        return None

    order_url = f"{config.API_ENDPOINT}/sendorder"
    order_data = {
        'Password': execution_password,
        'Symbol': symbol,
        'Exchange': 1,
        'SecurityType': 1,
        'Side': '2',  # '1': 売り, '2': 買い
        'CashMargin': 1,  # 1: 現物
        'DelivType': 2,
        'FundType': 'AA',
        'AccountType': 2,
        'Qty': qty,
        'FrontOrderType': 10,  # 10: 成行
        'Price': 0,
        'ExpireDay': 0
    }
    headers = {
        'Content-Type': 'application/json',
        'X-API-KEY': token
    }
    try:
        response = requests.post(order_url, headers=headers, json=order_data)
        if response.status_code == 200:
            return response.json()
        else:
            logging.error(f"Failed to place order: {response.text}")
            return None
    except Exception as e:
        logging.error(f"Exception in place_buy_order: {str(e)}")
        return None

def get_positions_from_kabustation(token: str, product: Optional[str], symbol: Optional[str], side: Optional[str], addinfo: bool) -> Optional[list]:
    url = f"{config.API_ENDPOINT}/positions"
    headers = {
        'Content-Type': 'application/json',
        'X-API-KEY': token
    }
    params = {}
    if product:
        params['product'] = product
    if symbol:
        params['symbol'] = symbol
    if side:
        params['side'] = side
    params['addinfo'] = str(addinfo).lower()

    try:
        response = requests.get(url, headers=headers, params=params)
        if response.status_code == 200:
            return response.json()
        else:
            logging.error(f"Failed to fetch positions: {response.text}")
            return None
    except Exception as e:
        logging.error(f"Exception in get_positions_from_kabustation: {str(e)}")
        return None

def get_asset_info(token: str) -> Optional[dict]:
    url = f"{config.API_ENDPOINT}/wallet/cash"
    headers = {
        'Content-Type': 'application/json',
        'X-API-KEY': token
    }
    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            data = response.json()
            return {
                'stockAccountWallet': data.get('StockAccountWallet'),
                'auKCStockAccountWallet': data.get('AuKCStockAccountWallet'),
                'auJbnStockAccountWallet': data.get('AuJbnStockAccountWallet')
            }
        else:
            logging.error(f"Failed to fetch asset info: {response.text}")
            return None
    except Exception as e:
        logging.error(f"Exception in get_asset_info: {str(e)}")
        return None

def get_user_by_id(user_id: str) -> Optional[User]:
    try:
        response = supabase.table('profiles').select('*').eq('id', user_id).single().execute()
        if response.get('error'):
            logging.error(f"Failed to fetch user: {response['error']}")
            return None
        data = response.get('data')
        if data:
            user = User(
                id=data['id'],
                email=data['email'],
                name=data['name'],
                api_password=data['aukabucom_api_password'],
                execution_password=data['aukabucom_login_password']
            )
            return user
        else:
            logging.error("User data is empty")
            return None
    except Exception as e:
        logging.error(f"Exception in get_user_by_id: {str(e)}")
        return None

# 必要に応じて他のサービス関数を追加
