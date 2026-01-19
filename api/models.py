from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    """User model for authentication and profile."""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.String(20), default='user')  # user | admin
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    challenges = db.relationship('Challenge', backref='user', lazy=True)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'role': self.role,
            'created_at': self.created_at.isoformat()
        }


class Plan(db.Model):
    """Pricing plans for trading challenges."""
    __tablename__ = 'plans'
    
    id = db.Column(db.Integer, primary_key=True)
    slug = db.Column(db.String(50), unique=True, nullable=False)  # starter | pro | elite
    name = db.Column(db.String(100), nullable=False)
    price_dh = db.Column(db.Float, nullable=False)
    features_json = db.Column(db.Text, nullable=True)
    start_balance = db.Column(db.Float, default=5000)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    challenges = db.relationship('Challenge', backref='plan', lazy=True)
    
    def to_dict(self):
        import json
        return {
            'id': self.id,
            'slug': self.slug,
            'name': self.name,
            'price_dh': self.price_dh,
            'features': json.loads(self.features_json) if self.features_json else [],
            'start_balance': self.start_balance,
            'created_at': self.created_at.isoformat()
        }


class PayPalSettings(db.Model):
    """Admin-configurable PayPal settings."""
    __tablename__ = 'paypal_settings'
    
    id = db.Column(db.Integer, primary_key=True)
    enabled = db.Column(db.Boolean, default=False)
    client_id = db.Column(db.String(256), nullable=True)
    client_secret = db.Column(db.String(256), nullable=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'enabled': self.enabled,
            'client_id': self.client_id,
            'client_secret': '***' if self.client_secret else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }


class Challenge(db.Model):
    """Trading challenge instance for a user."""
    __tablename__ = 'challenges'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    plan_id = db.Column(db.Integer, db.ForeignKey('plans.id'), nullable=False)
    start_balance = db.Column(db.Float, default=5000)
    equity = db.Column(db.Float, default=5000)
    status = db.Column(db.String(20), default='active')  # active | failed | passed
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    passed_at = db.Column(db.DateTime, nullable=True)
    failed_at = db.Column(db.DateTime, nullable=True)
    
    trades = db.relationship('Trade', backref='challenge', lazy=True)
    daily_metrics = db.relationship('DailyMetrics', backref='challenge', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'plan_id': self.plan_id,
            'plan': self.plan.to_dict() if self.plan else None,
            'start_balance': self.start_balance,
            'equity': self.equity,
            'status': self.status,
            'pnl': self.equity - self.start_balance,
            'pnl_pct': ((self.equity - self.start_balance) / self.start_balance) * 100,
            'created_at': self.created_at.isoformat(),
            'passed_at': self.passed_at.isoformat() if self.passed_at else None,
            'failed_at': self.failed_at.isoformat() if self.failed_at else None
        }


class Trade(db.Model):
    """Individual trade within a challenge."""
    __tablename__ = 'trades'
    
    id = db.Column(db.Integer, primary_key=True)
    challenge_id = db.Column(db.Integer, db.ForeignKey('challenges.id'), nullable=False)
    symbol = db.Column(db.String(20), nullable=False)
    side = db.Column(db.String(10), nullable=False)  # buy | sell
    qty = db.Column(db.Float, nullable=False)
    price = db.Column(db.Float, nullable=False)
    pnl = db.Column(db.Float, default=0)
    executed_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'challenge_id': self.challenge_id,
            'symbol': self.symbol,
            'side': self.side,
            'qty': self.qty,
            'price': self.price,
            'pnl': self.pnl,
            'executed_at': self.executed_at.isoformat()
        }


class DailyMetrics(db.Model):
    """Daily tracking of challenge performance."""
    __tablename__ = 'daily_metrics'
    
    id = db.Column(db.Integer, primary_key=True)
    challenge_id = db.Column(db.Integer, db.ForeignKey('challenges.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    day_start_equity = db.Column(db.Float, nullable=False)
    day_end_equity = db.Column(db.Float, nullable=True)
    day_pnl = db.Column(db.Float, default=0)
    max_intraday_drawdown_pct = db.Column(db.Float, default=0)
    
    def to_dict(self):
        return {
            'id': self.id,
            'challenge_id': self.challenge_id,
            'date': self.date.isoformat(),
            'day_start_equity': self.day_start_equity,
            'day_end_equity': self.day_end_equity,
            'day_pnl': self.day_pnl,
            'max_intraday_drawdown_pct': self.max_intraday_drawdown_pct
        }
