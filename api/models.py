from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.String(20), default='user')
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
    __tablename__ = 'plans'
    id = db.Column(db.Integer, primary_key=True)
    slug = db.Column(db.String(50), unique=True, nullable=False)
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

class Challenge(db.Model):
    __tablename__ = 'challenges'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    plan_id = db.Column(db.Integer, db.ForeignKey('plans.id'), nullable=False)
    start_balance = db.Column(db.Float, default=5000)
    equity = db.Column(db.Float, default=5000)
    status = db.Column(db.String(20), default='active')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    passed_at = db.Column(db.DateTime, nullable=True)
    failed_at = db.Column(db.DateTime, nullable=True)
    trades = db.relationship('Trade', backref='challenge', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'start_balance': self.start_balance,
            'equity': self.equity,
            'status': self.status,
            'created_at': self.created_at.isoformat()
        }

class Trade(db.Model):
    __tablename__ = 'trades'
    id = db.Column(db.Integer, primary_key=True)
    challenge_id = db.Column(db.Integer, db.ForeignKey('challenges.id'), nullable=False)
    symbol = db.Column(db.String(20), nullable=False)
    side = db.Column(db.String(10), nullable=False)
    qty = db.Column(db.Float, nullable=False)
    price = db.Column(db.Float, nullable=False)
    pnl = db.Column(db.Float, default=0)
    executed_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'symbol': self.symbol,
            'side': self.side,
            'qty': self.qty,
            'price': self.price,
            'pnl': self.pnl,
            'executed_at': self.executed_at.isoformat()
        }
