from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from datetime import datetime
import os

from api.config import config
from api.models import db
from api.services.bot_engine import generate_signal

def create_app(config_name=None):
    if config_name is None:
        config_name = os.getenv('FLASK_ENV', 'development')
    
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    # Initialize extensions
    cors_origins = ["http://localhost:5173", "http://localhost:3000"]
    if os.getenv('FRONTEND_URL'):
        cors_origins.append(os.getenv('FRONTEND_URL'))
        
    CORS(app, resources={r"/api/*": {"origins": cors_origins}})
    
    db.init_app(app)
    JWTManager(app)
    
    # Register blueprints (Assuming they exist, if not we skip or mock)
    # from api.routes.auth import auth_bp
    # app.register_blueprint(auth_bp, url_prefix='/api/auth')
    
    @app.route('/api/health')
    def health():
        return {'status': 'ok', 'message': 'TradeSense API is running'}

    return app

app = create_app()

@app.route('/api/cron-tick')
def cron_tick():
    """
    Called by Vercel Cron every minute.
    """
    ticket = generate_signal()
    return {"status": "Cron executed", "ticket": ticket}

# Expose 'app' for Vercel WSGI
application = app

if __name__ == '__main__':
    app.run(debug=True, port=5000)
