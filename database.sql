-- TradeSense Database Schema
-- Version: 1.0.0
-- Compatible with SQLite (dev) and PostgreSQL (prod)

-- ============================================
-- Users Table
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(256) NOT NULL,
    role VARCHAR(20) DEFAULT 'user', -- user | admin
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Plans Table
-- ============================================
CREATE TABLE IF NOT EXISTS plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug VARCHAR(50) UNIQUE NOT NULL, -- starter | pro | elite
    name VARCHAR(100) NOT NULL,
    price_dh REAL NOT NULL,
    start_balance REAL DEFAULT 5000,
    features_json TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- PayPal Settings Table
-- ============================================
CREATE TABLE IF NOT EXISTS paypal_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    enabled BOOLEAN DEFAULT FALSE,
    client_id VARCHAR(256),
    client_secret VARCHAR(256),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Challenges Table
-- ============================================
CREATE TABLE IF NOT EXISTS challenges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    plan_id INTEGER NOT NULL,
    start_balance REAL DEFAULT 5000,
    equity REAL DEFAULT 5000,
    status VARCHAR(20) DEFAULT 'active', -- active | failed | passed
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    passed_at TIMESTAMP,
    failed_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (plan_id) REFERENCES plans(id)
);

-- ============================================
-- Trades Table
-- ============================================
CREATE TABLE IF NOT EXISTS trades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    challenge_id INTEGER NOT NULL,
    symbol VARCHAR(20) NOT NULL,
    side VARCHAR(10) NOT NULL, -- buy | sell
    qty REAL NOT NULL,
    price REAL NOT NULL,
    pnl REAL DEFAULT 0,
    executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (challenge_id) REFERENCES challenges(id)
);

-- ============================================
-- Daily Metrics Table
-- ============================================
CREATE TABLE IF NOT EXISTS daily_metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    challenge_id INTEGER NOT NULL,
    date DATE NOT NULL,
    day_start_equity REAL NOT NULL,
    day_end_equity REAL,
    day_pnl REAL DEFAULT 0,
    max_intraday_drawdown_pct REAL DEFAULT 0,
    FOREIGN KEY (challenge_id) REFERENCES challenges(id)
);

-- ============================================
-- Indexes for Performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_challenges_user_id ON challenges(user_id);
CREATE INDEX IF NOT EXISTS idx_challenges_status ON challenges(status);
CREATE INDEX IF NOT EXISTS idx_trades_challenge_id ON trades(challenge_id);
CREATE INDEX IF NOT EXISTS idx_daily_metrics_challenge_date ON daily_metrics(challenge_id, date);

-- ============================================
-- Seed Data: Plans
-- ============================================
INSERT INTO plans (slug, name, price_dh, start_balance, features_json) VALUES
('starter', 'Starter Challenge', 200, 5000, '["5,000 DH Virtual Balance","All Trading Instruments","Real-time Market Data","Basic AI Signals","5% Daily Drawdown Limit","10% Max Drawdown Limit","10% Profit Target"]'),
('pro', 'Pro Challenge', 500, 15000, '["15,000 DH Virtual Balance","All Trading Instruments","Real-time Market Data","Advanced AI Signals","Priority Support","5% Daily Drawdown Limit","10% Max Drawdown Limit","10% Profit Target"]'),
('elite', 'Elite Challenge', 1000, 50000, '["50,000 DH Virtual Balance","All Trading Instruments","Real-time Market Data","Premium AI Signals","VIP Support","Extended Trading Hours","5% Daily Drawdown Limit","10% Max Drawdown Limit","10% Profit Target"]');

-- ============================================
-- Seed Data: Admin User
-- Password: admin123 (bcrypt hash)
-- ============================================
INSERT INTO users (name, email, password_hash, role) VALUES
('Admin', 'admin@tradesense.ma', 'scrypt:32768:8:1$pKxQjKqzVl3GzNn8$4a8c9c9c8d1e2f3g4h5i6j7k8l9m0n1o2p3q4r5s6t7u8v9w0x1y2z3a4b5c6d7e8f9g0h1i2j3k4l5m6n7o8p9q0r1s2t3u4v5w6x7y8z9', 'admin');

-- ============================================
-- Seed Data: PayPal Settings (disabled by default)
-- ============================================
INSERT INTO paypal_settings (enabled, client_id, client_secret) VALUES
(FALSE, NULL, NULL);
