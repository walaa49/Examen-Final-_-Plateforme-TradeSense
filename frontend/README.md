# TradeSense Frontend

React-based frontend for the TradeSense prop trading platform.

## Tech Stack

- **React 18** with Vite
- **TailwindCSS** for styling
- **TradingView Lightweight Charts** for trading charts
- **Framer Motion** for animations
- **React Router** for navigation
- **Axios** for API calls
- **React Hot Toast** for notifications

## Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`.

## Environment Variables

Create a `.env` file if needed:

```
VITE_API_URL=http://localhost:5000/api
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/pricing` | Pricing plans |
| `/auth` | Login/Register |
| `/checkout?plan=<slug>` | Checkout flow |
| `/dashboard` | Trading dashboard (protected) |
| `/leaderboard` | Top 10 traders |
| `/admin` | Admin settings (admin only) |

## Components

### UI Components (`src/components/ui/`)
- Button, Card, Badge, Modal
- Skeleton, StatCard, Progress

### Core Components (`src/components/`)
- Navbar, Footer, ProtectedRoute
- TradingChart, OrderPanel, SignalsPanel
- TradesTable, TickerStrip, LiveIndicator

## Features

- **Dark mode** by default
- **Real-time market data** with 15-30 second polling
- **TradingView charts** with candlestick display
- **AI trading signals** with confidence scores
- **Responsive design** for mobile and desktop
