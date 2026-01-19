# TradeSense - Prop Trading SaaS Platform

A complete prop trading challenge platform built with Flask (backend) and React (frontend).

![TradeSense](https://img.shields.io/badge/TradeSense-MVP-blue)
![Python](https://img.shields.io/badge/Python-3.9+-green)
![React](https://img.shields.io/badge/React-18-61dafb)

## Features

### Trading Challenge Engine
- Virtual balance starting at 5,000 DH (configurable per plan)
- **Daily Loss Limit**: 5% max equity drop per day → FAILED
- **Max Drawdown**: 10% total loss → FAILED  
- **Profit Target**: 10% gain → PASSED (Funded)

### Market Data
- **International**: Real-time quotes via yfinance (BTC-USD, ETH-USD, AAPL, TSLA, etc.)
- **Morocco**: Casablanca Stock Exchange scraper (IAM, ATW, BCP, LHM, CIH)
- Auto-updates every 15-30 seconds

### Payments
- Mock checkout with CMI, Crypto, PayPal options
- Admin-configurable PayPal settings
- Plans: Starter (200 DH), Pro (500 DH), Elite (1000 DH)

### Dashboard
- TradingView Lightweight Charts
- Order panel (Buy/Sell)
- AI trading signals with confidence scores
- Recent trades table
- Rule progress meters

### Leaderboard
- Top 10 traders of the month
- Sorted by profit percentage

---

## Project Structure

```
/
├── backend/
│   ├── app.py              # Flask application factory
│   ├── config.py           # Configuration
│   ├── models.py           # SQLAlchemy models
│   ├── seed.py             # Database seeder
│   ├── requirements.txt    # Python dependencies
│   ├── routes/
│   │   ├── auth.py         # Authentication endpoints
│   │   ├── plans.py        # Plans & checkout
│   │   ├── challenges.py   # Challenge management
│   │   ├── market.py       # Market data endpoints
│   │   ├── trades.py       # Trade execution
│   │   ├── leaderboard.py  # Leaderboard
│   │   └── admin.py        # Admin endpoints
│   └── services/
│       ├── rules.py        # Trading rule engine
│       ├── market.py       # yfinance service
│       ├── morocco_scraper.py  # Morocco stocks scraper
│       └── signals.py      # AI signals generator
│
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── context/AuthContext.jsx
│       ├── services/api.js
│       ├── hooks/useMarketData.js
│       ├── components/
│       │   ├── ui/          # Design system
│       │   ├── Navbar.jsx
│       │   ├── TradingChart.jsx
│       │   ├── OrderPanel.jsx
│       │   └── ...
│       └── pages/
│           ├── Landing.jsx
│           ├── Pricing.jsx
│           ├── Auth.jsx
│           ├── Checkout.jsx
│           ├── Dashboard.jsx
│           ├── Leaderboard.jsx
│           └── Admin.jsx
│
├── database.sql            # Schema export
└── README.md              # This file
```

---

## Quick Start

### Prerequisites
- Python 3.9+
- Node.js 18+
- npm

### 1. Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (Mac/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Initialize database and seed data
python seed.py

# Start server
flask run --port=5000
```

### 2. Frontend Setup

```bash
# In a new terminal, navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 3. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api

### Default Admin Credentials
- **Email**: `admin@tradesense.ma`
- **Password**: `admin123`

---

## API Reference

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login & get JWT |

### Plans & Checkout
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/plans` | List all plans |
| POST | `/api/checkout/mock` | Mock checkout |

### Challenges
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/challenges/active` | Get active challenge |
| GET | `/api/challenges/:id` | Get specific challenge |

### Market Data
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/market/quote?symbol=BTC-USD` | Get quote |
| GET | `/api/market/series?symbol=BTC-USD` | Get OHLCV data |
| GET | `/api/market/ma-quote?symbol=IAM` | Morocco stock |

### Trades
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/trades` | Execute trade |
| GET | `/api/trades?challenge_id=1` | List trades |

### Leaderboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/leaderboard/monthly-top10` | Top 10 traders |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/paypal-settings` | Get PayPal config |
| PUT | `/api/admin/paypal-settings` | Update PayPal |

---

## Environment Variables

### Backend
```bash
DATABASE_URL=sqlite:///tradesense.db  # or postgresql://...
JWT_SECRET=your-secret-key
FLASK_ENV=development
```

### Frontend
```bash
VITE_API_URL=http://localhost:5000/api
```

---

## Trading Rules

| Rule | Threshold | Result |
|------|-----------|--------|
| Daily Loss | -5% equity drop in a day | FAILED |
| Max Drawdown | -10% total loss | FAILED |
| Profit Target | +10% total gain | PASSED |

Rules are evaluated after every trade execution.

---

## Tech Stack

### Backend
- Flask 3.0
- Flask-JWT-Extended
- Flask-SQLAlchemy
- Flask-CORS
- yfinance
- BeautifulSoup4

### Frontend
- React 18
- Vite
- TailwindCSS
- TradingView Lightweight Charts
- Framer Motion
- React Router
- Axios

### Database
- SQLite (development)
- PostgreSQL (production)

---

## License

MIT License
