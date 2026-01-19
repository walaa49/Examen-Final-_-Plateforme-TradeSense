"""
Market Data Service using yfinance

Provides real-time quotes and historical data for international markets.
Includes caching to reduce API calls.
"""

import yfinance as yf
from datetime import datetime, timedelta
from functools import lru_cache
import time

# Simple in-memory cache
_quote_cache = {}
_series_cache = {}
CACHE_TTL_SECONDS = 30


def get_quote(symbol):
    """
    Get real-time quote for a symbol.
    Cached for 30 seconds.
    """
    cache_key = symbol.upper()
    now = time.time()
    
    # Check cache
    if cache_key in _quote_cache:
        cached_data, cached_time = _quote_cache[cache_key]
        if now - cached_time < CACHE_TTL_SECONDS:
            return cached_data
    
    try:
        ticker = yf.Ticker(symbol)
        info = ticker.info
        
        # Get the most relevant price
        price = info.get('regularMarketPrice') or info.get('currentPrice') or info.get('previousClose', 0)
        
        data = {
            'symbol': symbol.upper(),
            'price': price,
            'change': info.get('regularMarketChange', 0),
            'change_pct': info.get('regularMarketChangePercent', 0),
            'high': info.get('regularMarketDayHigh', price),
            'low': info.get('regularMarketDayLow', price),
            'open': info.get('regularMarketOpen', price),
            'prev_close': info.get('previousClose', price),
            'volume': info.get('regularMarketVolume', 0),
            'market_cap': info.get('marketCap', 0),
            'name': info.get('shortName', symbol),
            'currency': info.get('currency', 'USD'),
            'timestamp': datetime.utcnow().isoformat()
        }
        
        # Cache the result
        _quote_cache[cache_key] = (data, now)
        
        return data
    
    except Exception as e:
        # Return fallback data on error
        return {
            'symbol': symbol.upper(),
            'price': 0,
            'error': str(e),
            'timestamp': datetime.utcnow().isoformat()
        }


def get_series(symbol, interval='1m', range_param='1d'):
    """
    Get historical OHLCV data for charting.
    
    Intervals: 1m, 5m, 15m, 30m, 1h, 1d
    Ranges: 1d, 5d, 1mo, 3mo, 6mo, 1y
    """
    cache_key = f"{symbol.upper()}_{interval}_{range_param}"
    now = time.time()
    
    # Cache for 60 seconds for series data
    if cache_key in _series_cache:
        cached_data, cached_time = _series_cache[cache_key]
        if now - cached_time < 60:
            return cached_data
    
    try:
        ticker = yf.Ticker(symbol)
        
        # Map range to yfinance period
        period_map = {
            '1d': '1d',
            '5d': '5d',
            '1mo': '1mo',
            '3mo': '3mo',
            '6mo': '6mo',
            '1y': '1y'
        }
        
        period = period_map.get(range_param, '1d')
        
        # yfinance has limitations on intraday intervals
        # 1m data only available for last 7 days
        if interval in ['1m', '2m', '5m'] and period not in ['1d', '5d']:
            period = '5d'
        
        hist = ticker.history(period=period, interval=interval)
        
        if hist.empty:
            return {
                'symbol': symbol.upper(),
                'interval': interval,
                'range': range_param,
                'data': [],
                'error': 'No data available'
            }
        
        # Convert to list of OHLCV dicts
        candles = []
        for index, row in hist.iterrows():
            candles.append({
                'time': int(index.timestamp()),
                'open': round(row['Open'], 2),
                'high': round(row['High'], 2),
                'low': round(row['Low'], 2),
                'close': round(row['Close'], 2),
                'volume': int(row['Volume']) if 'Volume' in row else 0
            })
        
        data = {
            'symbol': symbol.upper(),
            'interval': interval,
            'range': range_param,
            'data': candles,
            'count': len(candles),
            'timestamp': datetime.utcnow().isoformat()
        }
        
        _series_cache[cache_key] = (data, now)
        
        return data
    
    except Exception as e:
        return {
            'symbol': symbol.upper(),
            'interval': interval,
            'range': range_param,
            'data': [],
            'error': str(e)
        }


def get_multiple_quotes(symbols):
    """
    Get quotes for multiple symbols at once.
    """
    results = {}
    for symbol in symbols:
        results[symbol] = get_quote(symbol)
    return results


# Clear cache function for testing
def clear_cache():
    global _quote_cache, _series_cache
    _quote_cache = {}
    _series_cache = {}
