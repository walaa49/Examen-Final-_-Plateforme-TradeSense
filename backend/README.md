# TradeSense Backend

Flask-based REST API for the TradeSense prop trading platform.

## Setup

```bash
# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (Mac/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

## Initialize Database

```bash
# This will create tables and seed initial data
python seed.py
```

## Run Server

```bash
flask run --port=5000
```

Or with debug:
```bash
python app.py
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login and get JWT token

### Plans & Checkout
- `GET /api/plans` - List pricing plans
- `POST /api/checkout/mock` - Mock checkout (requires auth)

### Challenges
- `GET /api/challenges/active` - Get active challenge
- `GET /api/challenges/:id` - Get challenge by ID

### Market Data
- `GET /api/market/quote?symbol=BTC-USD` - Get quote
- `GET /api/market/series?symbol=BTC-USD&interval=1m&range=1d` - Get OHLCV
- `GET /api/market/ma-quote?symbol=IAM` - Get Morocco stock quote

### Trades
- `POST /api/trades` - Execute trade
- `GET /api/trades?challenge_id=1` - List trades

### Leaderboard
- `GET /api/leaderboard/monthly-top10` - Top 10 traders

### Admin
- `GET /api/admin/paypal-settings` - Get PayPal config
- `PUT /api/admin/paypal-settings` - Update PayPal config

## Default Admin Credentials

- Email: `admin@tradesense.ma`
- Password: `admin123`
