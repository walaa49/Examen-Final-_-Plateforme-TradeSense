import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Base configuration."""
    SECRET_KEY = os.getenv('JWT_SECRET', 'tradesense-super-secret-key-2024')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET', 'tradesense-super-secret-key-2024')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=7)
    SQLALCHEMY_TRACK_MODIFICATIONS = False

class DevelopmentConfig(Config):
    """Development configuration."""
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'sqlite:///tradesense.db')

class ProductionConfig(Config):
    """Production configuration."""
    DEBUG = False
    
    @property
    def SQLALCHEMY_DATABASE_URI(self):
        uri = os.getenv('POSTGRES_URL') or os.getenv('DATABASE_URL')
        if uri and uri.startswith("postgres://"):
            uri = uri.replace("postgres://", "postgresql://", 1)
        # Fallback to ephemeral sqlite if no DB configured (avoids build crash)
        return uri or 'sqlite:///:memory:'

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
