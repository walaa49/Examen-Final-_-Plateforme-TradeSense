from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
import os
from api.config import config
from api.models import db

def create_app(config_name=None):
    if config_name is None:
        config_name = os.getenv('FLASK_ENV', 'development')
    
    app = Flask(__name__)
    
    # Use the config dictionary we defined
    if config_name not in config:
        config_name = 'default'
        
    # Apply config based on the object (if it's a class, we might need to instantiate or use from_object directly)
    # The standard way in Flask is app.config.from_object(ConfigClass)
    app.config.from_object(config[config_name])
    
    # Initialize extensions
    cors_origins = ["http://localhost:5173", "http://localhost:3000"]
    frontend_url = os.getenv('FRONTEND_URL')
    if frontend_url:
        cors_origins.append(frontend_url)
        
    CORS(app, resources={r"/api/*": {"origins": cors_origins}})
    
    db.init_app(app)
    JWTManager(app)
    
    @app.route('/api/health')
    def health():
        return {'status': 'ok', 'message': 'TradeSense API is running'}

    return app

# Initialize the application
app = create_app()

# Safely attempt to create tables (Auto-Migration style)
with app.app_context():
    try:
        db.create_all()
        print(">>> Database tables created (or already exist).")
    except Exception as e:
        print(f">>> WARNING: Database connection failed or not configured. App running in 'No-DB' mode. Error: {e}")

# Expose 'app' for Vercel WSGI
application = app

# Vercel Serverless Function Entry Point mechanism
# No app.run() needed here.
