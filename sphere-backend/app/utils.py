# utils.py
from supabase import create_client, Client
from .config import SUPABASE_URL, SUPABASE_KEY

# Supabaseクライアントの初期化
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

async def get_user_credentials(user_id: str):
    response = supabase.table('profiles').select('aukabucom_api_password', 'aukabucom_login_password').eq('id', user_id).single().execute()

    if response.error:
        raise Exception(f"Error fetching user credentials: {response.error.message}")

    user_data = response.data
    return user_data['aukabucom_api_password'], user_data['aukabucom_login_password']


# 必要に応じて他のユーティリティ関数を追加
