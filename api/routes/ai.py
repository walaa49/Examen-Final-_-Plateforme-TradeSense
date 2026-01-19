from flask import Blueprint, request, jsonify
from datetime import datetime
from flask_jwt_extended import jwt_required
from services.ai_advisor import get_ai_analysis, get_ai_chat_response
from services.market import get_quote
from services.morocco_scraper import get_morocco_quote

ai_bp = Blueprint('ai', __name__)

MOROCCO_SYMBOLS = ['IAM', 'ATW', 'BCP', 'LHM', 'CIH']


@ai_bp.route('/chat', methods=['POST'])
@jwt_required()
def chat_with_ai():
    """
    Chat with the AI Advisor.
    """
    data = request.get_json()
    if not data or 'message' not in data:
        return jsonify({'error': 'Message is required'}), 400
        
    message = data.get('message')
    context = data.get('context', {})
    
    response = get_ai_chat_response(message, context)
    
    return jsonify({
        'response': response,
        'timestamp': datetime.now().isoformat()
    }), 200

@ai_bp.route('/analyze', methods=['POST'])
@jwt_required()
def analyze_market():
    """
    Get AI-powered market analysis for a specific symbol.
    """
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
        
    symbol = data.get('symbol')
    timeframe = data.get('timeframe', '1h')
    
    if not symbol:
        return jsonify({'error': 'Symbol is required'}), 400
        
    # fetch real-time data to feed the AI
    try:
        if symbol.upper() in MOROCCO_SYMBOLS:
            quote = get_morocco_quote(symbol.upper())
        else:
            quote = get_quote(symbol.upper())
            
        if not quote:
            return jsonify({'error': 'Could not fetch market data'}), 500
            
    except Exception as e:
        return jsonify({'error': f'Data fetch error: {str(e)}'}), 500
        
    # Generate analysis
    analysis = get_ai_analysis(
        symbol=symbol,
        timeframe=timeframe,
        price_data=quote
    )
    
    return jsonify({
        'symbol': symbol,
        'analysis': analysis,
        'timestamp': quote.get('timestamp')
    }), 200
