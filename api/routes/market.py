from flask import Blueprint, request, jsonify
from api.services.market import get_quote, get_series
from api.services.morocco_scraper import get_morocco_quote
from api.services.calendar_service import get_economic_calendar

market_bp = Blueprint('market', __name__)

@market_bp.route('/quote', methods=['GET'])
def quote():
    """Get real-time quote for a symbol via yfinance."""
    symbol = request.args.get('symbol', 'BTC-USD')
    
    try:
        data = get_quote(symbol)
        return jsonify(data), 200
    except Exception as e:
        return jsonify({
            'error': f'Failed to fetch quote: {str(e)}',
            'symbol': symbol
        }), 500


@market_bp.route('/series', methods=['GET'])
def series():
    """Get historical OHLCV data for charting."""
    symbol = request.args.get('symbol', 'BTC-USD')
    interval = request.args.get('interval', '1m')
    range_param = request.args.get('range', '1d')
    
    try:
        data = get_series(symbol, interval, range_param)
        return jsonify(data), 200
    except Exception as e:
        return jsonify({
            'error': f'Failed to fetch series: {str(e)}',
            'symbol': symbol
        }), 500


@market_bp.route('/ma-quote', methods=['GET'])
def morocco_quote():
    """Get Morocco stock quote via scraper."""
    symbol = request.args.get('symbol', 'IAM')
    
    try:
        data = get_morocco_quote(symbol)
        return jsonify(data), 200
    except Exception as e:
        return jsonify({
            'error': f'Failed to fetch Morocco quote: {str(e)}',
            'symbol': symbol,
            'fallback': True,
            'price': None
        }), 500

@market_bp.route('/calendar', methods=['GET'])
def calendar():
    """Get economic calendar events."""
    limit = request.args.get('limit', type=int)
    impact_filter = request.args.get('impact')
    
    try:
        events = get_economic_calendar()
        
        # Filtering
        if impact_filter:
            events = [e for e in events if e['impact'].lower() == impact_filter.lower()]
            
        # Sorting by time (simple string sort works for HH:MM if all same day, roughly)
        # events.sort(key=lambda x: x['time']) 
        
        # Limiting
        if limit and limit > 0:
            events = events[:limit]
            
        return jsonify(events), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
