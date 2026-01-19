import os
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from config import config
from models import db

def create_app(config_name=None):
    """Application factory."""
    if config_name is None:
        config_name = os.getenv('FLASK_ENV', 'development')
    
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    # Initialize extensions
    cors_origins = ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"]
    if os.getenv('FRONTEND_URL'):
        cors_origins.append(os.getenv('FRONTEND_URL'))
        
    CORS(app, resources={
        r"/api/*": {
            "origins": cors_origins,
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })
    
    db.init_app(app)
    JWTManager(app)
    
    # Register blueprints
    from routes.auth import auth_bp
    from routes.plans import plans_bp
    from routes.challenges import challenges_bp
    from routes.market import market_bp
    from routes.trades import trades_bp
    from routes.leaderboard import leaderboard_bp
    from routes.admin import admin_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(plans_bp, url_prefix='/api')
    app.register_blueprint(challenges_bp, url_prefix='/api/challenges')
    app.register_blueprint(market_bp, url_prefix='/api/market')
    app.register_blueprint(trades_bp, url_prefix='/api')
    app.register_blueprint(leaderboard_bp, url_prefix='/api/leaderboard')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    
    from routes.ai import ai_bp
    app.register_blueprint(ai_bp, url_prefix='/api/ai')
    
    # Create tables
    with app.app_context():
        db.create_all()
    
    @app.route('/api/health')
    def health():
        return {'status': 'ok', 'message': 'TradeSense API is running'}
    
    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True, port=5000)
