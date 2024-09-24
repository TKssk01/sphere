from supabase_py import create_client, Client
from fastapi import FastAPI, HTTPException

app = FastAPI()

url: str = "https://xyzcompany.supabase.co"
key: str = "public-anon-key"
supabase: Client = create_client(url, key)

API_PASSWORD = None

@app.on_event("startup")
async def startup_event():
    global API_PASSWORD
    table = "your_table"
    response = supabase.table(table).select("api_password").eq('id', your_id)

    if response.error:
        raise HTTPException(status_code=500, detail="Failed to get API password")

    API_PASSWORD = response['data'][0]['api_password']