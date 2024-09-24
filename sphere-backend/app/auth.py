# auth.py
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    # トークンをデコードしてユーザー情報を取得する処理を実装
    # ここでは例として、トークンからユーザーIDを取得するものとします
    user_id = decode_token(token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    return User(id=user_id)

def decode_token(token: str):
    # トークンのデコード処理を実装
    pass

class User:
    def __init__(self, id):
        self.id = id
