import requests
import json

BASE_URL = 'http://localhost:5000/api'

def test_ai():
    # 1. Login
    print("Logging in...")
    resp = requests.post(f"{BASE_URL}/auth/login", json={
        "email": "admin@tradesense.ma",
        "password": "admin123"
    })
    
    if resp.status_code != 200:
        print("Login failed:", resp.text)
        return
        
    token = resp.json()['token']
    headers = {'Authorization': f'Bearer {token}'}
    
    # 2. Call AI Analyze for AAPL
    print("\nTesting AI Analysis for AAPL...")
    resp = requests.post(
        f"{BASE_URL}/ai/analyze",
        headers=headers,
        json={"symbol": "AAPL", "timeframe": "4h"}
    )
    
    print(f"Status: {resp.status_code}")
    print("Response:")
    print(json.dumps(resp.json(), indent=2))
    
    # 3. Call AI Analysis for Moroccan Stock
    print("\nTesting AI Analysis for IAM (Maroc Telecom)...")
    resp = requests.post(
        f"{BASE_URL}/ai/analyze",
        headers=headers,
        json={"symbol": "IAM", "timeframe": "1d"}
    )
    
    print(f"Status: {resp.status_code}")
    print("Response:")
    print(json.dumps(resp.json(), indent=2))

if __name__ == '__main__':
    test_ai()
