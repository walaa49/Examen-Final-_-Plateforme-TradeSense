"""
AI Trading Signals Generator

Rule-based signal generation with confidence scores.
Provides BUY/SELL/NEUTRAL signals with reasoning.
"""

from services.market import get_quote, get_series
from services.morocco_scraper import get_morocco_quote

MOROCCO_SYMBOLS = ['IAM', 'ATW', 'BCP', 'LHM', 'CIH']


def generate_signal(symbol):
    """
    Generate a trading signal for a given symbol.
    Uses rule-based analysis with price momentum and volatility.
    """
    symbol = symbol.upper()
    
    try:
        # Get current quote
        if symbol in MOROCCO_SYMBOLS:
            quote = get_morocco_quote(symbol)
        else:
            quote = get_quote(symbol)
        
        if not quote or not quote.get('price'):
            return {
                'symbol': symbol,
                'signal': 'NEUTRAL',
                'confidence': 0,
                'reasons': ['Unable to fetch price data'],
                'price': None
            }
        
        price = quote['price']
        change_pct = quote.get('change_pct', 0)
        
        # Get historical data for analysis
        series = None
        if symbol not in MOROCCO_SYMBOLS:
            series = get_series(symbol, '1h', '5d')
        
        signal, confidence, reasons = analyze_price_action(quote, series)
        
        return {
            'symbol': symbol,
            'signal': signal,
            'confidence': confidence,
            'reasons': reasons,
            'price': price,
            'change_pct': change_pct,
            'timestamp': quote.get('timestamp')
        }
    
    except Exception as e:
        return {
            'symbol': symbol,
            'signal': 'NEUTRAL',
            'confidence': 0,
            'reasons': [f'Error analyzing: {str(e)}'],
            'error': str(e)
        }


def analyze_price_action(quote, series):
    """
    Analyze price action to determine signal.
    Returns (signal, confidence, reasons).
    """
    reasons = []
    buy_score = 0
    sell_score = 0
    
    change_pct = quote.get('change_pct', 0)
    price = quote.get('price', 0)
    high = quote.get('high', price)
    low = quote.get('low', price)
    
    # Rule 1: Momentum
    if change_pct > 2:
        buy_score += 2
        reasons.append(f'Strong upward momentum: +{change_pct:.2f}%')
    elif change_pct > 0.5:
        buy_score += 1
        reasons.append(f'Positive price movement: +{change_pct:.2f}%')
    elif change_pct < -2:
        sell_score += 2
        reasons.append(f'Strong downward momentum: {change_pct:.2f}%')
    elif change_pct < -0.5:
        sell_score += 1
        reasons.append(f'Negative price movement: {change_pct:.2f}%')
    else:
        reasons.append('Price consolidating in neutral range')
    
    # Rule 2: Position in daily range
    if high > low:
        range_position = (price - low) / (high - low)
        if range_position > 0.8:
            buy_score += 1
            reasons.append('Price near daily high - bullish strength')
        elif range_position < 0.2:
            sell_score += 1
            reasons.append('Price near daily low - bearish weakness')
    
    # Rule 3: Volume analysis (if available)
    volume = quote.get('volume', 0)
    if volume > 0:
        if volume > 10000000:  # High volume
            if change_pct > 0:
                buy_score += 1
                reasons.append('High volume with positive price action')
            elif change_pct < 0:
                sell_score += 1
                reasons.append('High volume with negative price action')
    
    # Rule 4: Historical trend analysis (if series available)
    if series and series.get('data'):
        candles = series['data']
        if len(candles) >= 20:
            # Simple moving average comparison
            recent_prices = [c['close'] for c in candles[-20:]]
            sma_20 = sum(recent_prices) / 20
            
            if price > sma_20 * 1.02:
                buy_score += 1
                reasons.append(f'Price above 20-period SMA ({sma_20:.2f})')
            elif price < sma_20 * 0.98:
                sell_score += 1
                reasons.append(f'Price below 20-period SMA ({sma_20:.2f})')
    
    # Determine signal
    total_score = buy_score + sell_score
    if total_score == 0:
        return 'NEUTRAL', 50, reasons
    
    if buy_score > sell_score:
        signal = 'BUY'
        confidence = min(50 + (buy_score - sell_score) * 15, 95)
    elif sell_score > buy_score:
        signal = 'SELL'
        confidence = min(50 + (sell_score - buy_score) * 15, 95)
    else:
        signal = 'NEUTRAL'
        confidence = 50
    
    return signal, confidence, reasons


def get_multiple_signals(symbols):
    """
    Generate signals for multiple symbols.
    """
    results = {}
    for symbol in symbols:
        results[symbol] = generate_signal(symbol)
    return results


def get_market_overview():
    """
    Get a quick overview of major market signals.
    """
    major_symbols = ['BTC-USD', 'AAPL', 'TSLA', 'IAM', 'ATW']
    return get_multiple_signals(major_symbols)
