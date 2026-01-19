from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from models import db, Trade, Challenge
from services.market import get_quote
from services.morocco_scraper import get_morocco_quote
from services.rules import evaluate_challenge_rules
import random

trades_bp = Blueprint('trades', __name__)

MOROCCO_SYMBOLS = ['IAM', 'ATW', 'BCP', 'LHM', 'CIH']

@trades_bp.route('/trades', methods=['POST'])
@jwt_required()
def create_trade():
    """Execute a trade and update challenge equity."""
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    challenge_id = data.get('challenge_id')
    symbol = data.get('symbol')
    side = data.get('side')  # buy | sell
    qty = data.get('qty')
    
    if not all([challenge_id, symbol, side, qty]):
        return jsonify({'error': 'challenge_id, symbol, side, and qty are required'}), 400
    
    if side not in ['buy', 'sell']:
        return jsonify({'error': 'Side must be buy or sell'}), 400
    
    try:
        qty = float(qty)
        if qty <= 0:
            raise ValueError()
    except:
        return jsonify({'error': 'Qty must be a positive number'}), 400
    
    # Get challenge
    user_id = get_jwt_identity()
    challenge = Challenge.query.get(challenge_id)
    
    if not challenge:
        return jsonify({'error': 'Challenge not found'}), 404
    
    if challenge.user_id != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    if challenge.status != 'active':
        return jsonify({'error': f'Challenge is {challenge.status}. Cannot trade.'}), 400
    
    # Get current price
    try:
        if symbol.upper() in MOROCCO_SYMBOLS:
            quote_data = get_morocco_quote(symbol)
        else:
            quote_data = get_quote(symbol)
        
        price = quote_data.get('price', 0)
        if not price:
            return jsonify({'error': 'Could not get price for symbol'}), 500
    except Exception as e:
        return jsonify({'error': f'Failed to get price: {str(e)}'}), 500
    
    # Calculate trade value and simulate PnL
    trade_value = price * qty
    
    # Simulate PnL: random between -3% and +3% of trade value
    pnl_pct = random.uniform(-0.03, 0.03)
    pnl = trade_value * pnl_pct
    
    # For sell trades, invert the logic slightly
    if side == 'sell':
        pnl = -pnl
    
    # Create trade
    trade = Trade(
        challenge_id=challenge_id,
        symbol=symbol.upper(),
        side=side,
        qty=qty,
        price=price,
        pnl=round(pnl, 2)
    )
    
    # Update challenge equity
    challenge.equity = round(challenge.equity + pnl, 2)
    
    db.session.add(trade)
    db.session.commit()
    
    # Evaluate rules
    rule_result = evaluate_challenge_rules(challenge)
    
    return jsonify({
        'message': 'Trade executed successfully',
        'trade': trade.to_dict(),
        'challenge': challenge.to_dict(),
        'rule_result': rule_result
    }), 201


@trades_bp.route('/trades', methods=['GET'])
@jwt_required()
def get_trades():
    """Get trades for a challenge."""
    challenge_id = request.args.get('challenge_id')
    
    if not challenge_id:
        return jsonify({'error': 'challenge_id is required'}), 400
    
    user_id = get_jwt_identity()
    claims = get_jwt()
    challenge = Challenge.query.get(challenge_id)
    
    if not challenge:
        return jsonify({'error': 'Challenge not found'}), 404
    
    if challenge.user_id != user_id and claims.get('role') != 'admin':
        return jsonify({'error': 'Unauthorized'}), 403
    
    trades = Trade.query.filter_by(challenge_id=challenge_id).order_by(
        Trade.executed_at.desc()
    ).all()
    
    return jsonify({
        'trades': [t.to_dict() for t in trades]
    }), 200
