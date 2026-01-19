from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Plan, Challenge, PayPalSettings

plans_bp = Blueprint('plans', __name__)

@plans_bp.route('/plans', methods=['GET'])
def get_plans():
    """Get all available pricing plans."""
    plans = Plan.query.all()
    
    # Check if PayPal is enabled
    paypal_settings = PayPalSettings.query.first()
    paypal_enabled = paypal_settings.enabled if paypal_settings else False
    
    return jsonify({
        'plans': [plan.to_dict() for plan in plans],
        'paypal_enabled': paypal_enabled
    }), 200


@plans_bp.route('/checkout/mock', methods=['POST'])
@jwt_required()
def mock_checkout():
    """Mock checkout - creates an active challenge for the user."""
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    plan_slug = data.get('plan_slug')
    method = data.get('method')  # CMI | CRYPTO | PAYPAL
    
    if not plan_slug:
        return jsonify({'error': 'Plan slug is required'}), 400
    
    if method not in ['CMI', 'CRYPTO', 'PAYPAL']:
        return jsonify({'error': 'Invalid payment method'}), 400
    
    # Get plan
    plan = Plan.query.filter_by(slug=plan_slug).first()
    if not plan:
        return jsonify({'error': 'Plan not found'}), 404
    
    # Get current user
    user_id = get_jwt_identity()
    
    # Check for existing active challenge
    existing_challenge = Challenge.query.filter_by(
        user_id=user_id, 
        status='active'
    ).first()
    
    if existing_challenge:
        return jsonify({'error': 'You already have an active challenge'}), 400
    
    # Create new challenge
    challenge = Challenge(
        user_id=user_id,
        plan_id=plan.id,
        start_balance=plan.start_balance,
        equity=plan.start_balance,
        status='active'
    )
    
    db.session.add(challenge)
    db.session.commit()
    
    return jsonify({
        'message': 'Payment successful! Challenge started.',
        'challenge': challenge.to_dict()
    }), 201
