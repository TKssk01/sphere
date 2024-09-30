import requests
import json
import pprint

def test_kabu_api_token(api_password: str):
    obj = {'APIPassword': api_password}
    headers = {'Content-Type': 'application/json'}
    url = 'http://localhost:18080/kabusapi/token'

    try:
        response = requests.post(url, headers=headers, json=obj)
        response.raise_for_status()
        content = response.json()
        print("Kabu API Token:", content.get("Token"))
    except requests.HTTPError as e:
        print(f"HTTP Error: {e.response.status_code} - {e.response.text}")
    except Exception as e:
        print(f"Unexpected Error: {e}")

# テスト実行
if __name__ == "__main__":
    test_kabu_api_token('1995taka')  # 有効なAPIPasswordに置き換えてください
