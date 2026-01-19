"""
Database Seed Script

Creates initial data: plans, admin user, and PayPal settings.
"""

from app import app, db
from models import User, Plan, PayPalSettings
import json

def seed_database():
    with app.app_context():
        # Create all tables
        db.create_all()
        
        # Seed Plans
        plans_data = [
            {
                'slug': 'starter',
                'name': 'Starter Challenge',
                'price_dh': 200,
                'start_balance': 5000,
                'features': [
                    '5,000 DH Virtual Balance',
                    'All Trading Instruments',
                    'Real-time Market Data',
                    'Basic AI Signals',
                    '5% Daily Drawdown Limit',
                    '10% Max Drawdown Limit',
                    '10% Profit Target'
                ]
            },
            {
                'slug': 'pro',
                'name': 'Pro Challenge',
                'price_dh': 500,
                'start_balance': 15000,
                'features': [
                    '15,000 DH Virtual Balance',
                    'All Trading Instruments',
                    'Real-time Market Data',
                    'Advanced AI Signals',
                    'Priority Support',
                    '5% Daily Drawdown Limit',
                    '10% Max Drawdown Limit',
                    '10% Profit Target'
                ]
            },
            {
                'slug': 'elite',
                'name': 'Elite Challenge',
                'price_dh': 1000,
                'start_balance': 50000,
                'features': [
                    '50,000 DH Virtual Balance',
                    'All Trading Instruments',
                    'Real-time Market Data',
                    'Premium AI Signals',
                    'VIP Support',
                    'Extended Trading Hours',
                    '5% Daily Drawdown Limit',
                    '10% Max Drawdown Limit',
                    '10% Profit Target'
                ]
            }
        ]
        
        for plan_data in plans_data:
            existing = Plan.query.filter_by(slug=plan_data['slug']).first()
            if not existing:
                plan = Plan(
                    slug=plan_data['slug'],
                    name=plan_data['name'],
                    price_dh=plan_data['price_dh'],
                    start_balance=plan_data['start_balance'],
                    features_json=json.dumps(plan_data['features'])
                )
                db.session.add(plan)
                print(f"Created plan: {plan_data['name']}")
            else:
                print(f"Plan already exists: {plan_data['slug']}")
        
        # Seed Admin User
        admin_email = 'admin@tradesense.ma'
        admin = User.query.filter_by(email=admin_email).first()
        if not admin:
            admin = User(
                name='Admin',
                email=admin_email,
                role='admin'
            )
            admin.set_password('admin123')
            db.session.add(admin)
            print(f"Created admin user: {admin_email}")
        else:
            print(f"Admin already exists: {admin_email}")
        
        # Seed PayPal Settings
        paypal_settings = PayPalSettings.query.first()
        if not paypal_settings:
            paypal_settings = PayPalSettings(
                enabled=False,
                client_id=None,
                client_secret=None
            )
            db.session.add(paypal_settings)
            print("Created PayPal settings")
        else:
            print("PayPal settings already exist")
        
        db.session.commit()
        print("\n✅ Database seeded successfully!")
        print("\nAdmin credentials:")
        print(f"  Email: {admin_email}")
        print(f"  Password: admin123")


if __name__ == '__main__':
    seed_database()
