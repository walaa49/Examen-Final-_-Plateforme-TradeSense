"""
Trading Challenge Rule Engine

Business Rules:
- Max daily loss: if equity drops 5% in a day → FAILED
- Max total loss: if equity drops 10% overall → FAILED
- Profit target: if equity increases 10% → PASSED (Funded)
"""

from datetime import datetime
from api.models import db, Challenge, DailyMetrics

def evaluate_challenge_rules(challenge):
    """
    Evaluate all trading rules after a trade.
    Returns a dict with rule evaluation results.
    """
    result = {
        'status': challenge.status,
        'rules_checked': [],
        'triggered': None
    }
    
    if challenge.status != 'active':
        result['rules_checked'].append('Challenge not active, skipping rules')
        return result
    
    start_balance = challenge.start_balance
    current_equity = challenge.equity
    
    # Calculate total PnL percentage
    total_pnl_pct = ((current_equity - start_balance) / start_balance) * 100
    
    # Rule 1: Max total loss (10%)
    if total_pnl_pct <= -10:
        challenge.status = 'failed'
        challenge.failed_at = datetime.utcnow()
        db.session.commit()
        
        result['status'] = 'failed'
        result['triggered'] = 'MAX_TOTAL_LOSS'
        result['rules_checked'].append(f'Total loss {total_pnl_pct:.2f}% exceeds -10% limit')
        return result
    
    result['rules_checked'].append(f'Total loss check: {total_pnl_pct:.2f}% (limit: -10%)')
    
    # Rule 2: Profit target (10%)
    if total_pnl_pct >= 10:
        challenge.status = 'passed'
        challenge.passed_at = datetime.utcnow()
        db.session.commit()
        
        result['status'] = 'passed'
        result['triggered'] = 'PROFIT_TARGET_REACHED'
        result['rules_checked'].append(f'Profit target reached: {total_pnl_pct:.2f}% (target: +10%)')
        return result
    
    result['rules_checked'].append(f'Profit target check: {total_pnl_pct:.2f}% (target: +10%)')
    
    # Rule 3: Max daily loss (5%)
    daily_loss_pct = check_daily_loss(challenge)
    
    if daily_loss_pct <= -5:
        challenge.status = 'failed'
        challenge.failed_at = datetime.utcnow()
        db.session.commit()
        
        result['status'] = 'failed'
        result['triggered'] = 'MAX_DAILY_LOSS'
        result['rules_checked'].append(f'Daily loss {daily_loss_pct:.2f}% exceeds -5% limit')
        return result
    
    result['rules_checked'].append(f'Daily loss check: {daily_loss_pct:.2f}% (limit: -5%)')
    
    return result


def check_daily_loss(challenge):
    """
    Calculate the current day's PnL percentage.
    Uses daily_metrics table or calculates from trades.
    """
    from api.models import Trade
    from datetime import date
    
    today = date.today()
    
    # Get or create today's metrics
    daily_metric = DailyMetrics.query.filter_by(
        challenge_id=challenge.id,
        date=today
    ).first()
    
    if not daily_metric:
        # Create new daily metric with current equity as day start
        daily_metric = DailyMetrics(
            challenge_id=challenge.id,
            date=today,
            day_start_equity=challenge.equity,
            day_end_equity=challenge.equity,
            day_pnl=0,
            max_intraday_drawdown_pct=0
        )
        db.session.add(daily_metric)
        db.session.commit()
        return 0
    
    # Calculate day PnL
    day_start = daily_metric.day_start_equity
    current = challenge.equity
    day_pnl = current - day_start
    day_pnl_pct = (day_pnl / day_start) * 100 if day_start > 0 else 0
    
    # Update daily metric
    daily_metric.day_end_equity = current
    daily_metric.day_pnl = day_pnl
    
    # Track max drawdown
    if day_pnl_pct < daily_metric.max_intraday_drawdown_pct:
        daily_metric.max_intraday_drawdown_pct = day_pnl_pct
    
    db.session.commit()
    
    return day_pnl_pct


def get_challenge_metrics(challenge):
    """
    Get detailed metrics for a challenge.
    """
    start_balance = challenge.start_balance
    current_equity = challenge.equity
    total_pnl = current_equity - start_balance
    total_pnl_pct = (total_pnl / start_balance) * 100 if start_balance > 0 else 0
    
    # Calculate daily loss
    daily_pnl_pct = check_daily_loss(challenge)
    
    return {
        'start_balance': start_balance,
        'current_equity': current_equity,
        'total_pnl': round(total_pnl, 2),
        'total_pnl_pct': round(total_pnl_pct, 2),
        'daily_pnl_pct': round(daily_pnl_pct, 2),
        'rules': {
            'daily_loss_limit': -5,
            'total_loss_limit': -10,
            'profit_target': 10
        },
        'progress': {
            'daily_loss_used': round(abs(min(daily_pnl_pct, 0)), 2),
            'total_loss_used': round(abs(min(total_pnl_pct, 0)), 2),
            'profit_progress': round(max(total_pnl_pct, 0), 2)
        }
    }
