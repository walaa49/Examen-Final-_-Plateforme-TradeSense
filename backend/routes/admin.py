from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from models import db, PayPalSettings

admin_bp = Blueprint('admin', __name__)

def admin_required():
    """Check if current user is admin."""
    claims = get_jwt()
    return claims.get('role') == 'admin'


@admin_bp.route('/paypal-settings', methods=['GET'])
@jwt_required()
def get_paypal_settings():
    """Get PayPal settings (admin only)."""
    if not admin_required():
        return jsonify({'error': 'Admin access required'}), 403
    
    settings = PayPalSettings.query.first()
    
    if not settings:
        return jsonify({
            'settings': {
                'enabled': False,
                'client_id': None,
                'client_secret': None
            }
        }), 200
    
    return jsonify({'settings': settings.to_dict()}), 200


@admin_bp.route('/paypal-settings', methods=['PUT'])
@jwt_required()
def update_paypal_settings():
    """Update PayPal settings (admin only)."""
    if not admin_required():
        return jsonify({'error': 'Admin access required'}), 403
    
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    settings = PayPalSettings.query.first()
    
    if not settings:
        settings = PayPalSettings()
        db.session.add(settings)
    
    if 'enabled' in data:
        settings.enabled = bool(data['enabled'])
    
    if 'client_id' in data:
        settings.client_id = data['client_id']
    
    if 'client_secret' in data:
        settings.client_secret = data['client_secret']
    
    db.session.commit()
    
    return jsonify({
        'message': 'PayPal settings updated',
        'settings': settings.to_dict()
    }), 200
