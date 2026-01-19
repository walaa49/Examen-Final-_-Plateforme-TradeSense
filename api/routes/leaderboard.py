from flask import Blueprint, jsonify
from models import db, Challenge, User
from sqlalchemy import func, extract
from datetime import datetime

leaderboard_bp = Blueprint('leaderboard', __name__)

@leaderboard_bp.route('/monthly-top10', methods=['GET'])
def monthly_top10():
    """Get top 10 traders of the current month by profit percentage."""
    now = datetime.utcnow()
    current_month = now.month
    current_year = now.year
    
    # Query challenges created this month, calculate profit %
    results = db.session.query(
        User.id,
        User.name,
        Challenge.id.label('challenge_id'),
        Challenge.start_balance,
        Challenge.equity,
        Challenge.status,
        ((Challenge.equity - Challenge.start_balance) / Challenge.start_balance * 100).label('profit_pct')
    ).join(User, Challenge.user_id == User.id).filter(
        extract('month', Challenge.created_at) == current_month,
        extract('year', Challenge.created_at) == current_year
    ).order_by(
        ((Challenge.equity - Challenge.start_balance) / Challenge.start_balance * 100).desc()
    ).limit(10).all()
    
    leaderboard = []
    for i, row in enumerate(results, 1):
        leaderboard.append({
            'rank': i,
            'user_id': row.id,
            'name': row.name,
            'challenge_id': row.challenge_id,
            'start_balance': row.start_balance,
            'equity': row.equity,
            'profit_pct': round(row.profit_pct, 2),
            'status': row.status
        })
    
    return jsonify({
        'month': now.strftime('%B %Y'),
        'leaderboard': leaderboard
    }), 200
