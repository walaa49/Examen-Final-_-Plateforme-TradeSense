from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from models import Challenge

challenges_bp = Blueprint('challenges', __name__)

@challenges_bp.route('/active', methods=['GET'])
@jwt_required()
def get_active_challenge():
    """Get user's active challenge."""
    user_id = get_jwt_identity()
    
    challenge = Challenge.query.filter_by(
        user_id=user_id,
        status='active'
    ).first()
    
    if not challenge:
        return jsonify({'challenge': None, 'message': 'No active challenge'}), 200
    
    return jsonify({'challenge': challenge.to_dict()}), 200


@challenges_bp.route('/<int:challenge_id>', methods=['GET'])
@jwt_required()
def get_challenge(challenge_id):
    """Get specific challenge details."""
    user_id = get_jwt_identity()
    claims = get_jwt()
    
    challenge = Challenge.query.get(challenge_id)
    
    if not challenge:
        return jsonify({'error': 'Challenge not found'}), 404
    
    # Users can only view their own challenges (unless admin)
    if challenge.user_id != user_id and claims.get('role') != 'admin':
        return jsonify({'error': 'Unauthorized'}), 403
    
    return jsonify({'challenge': challenge.to_dict()}), 200


@challenges_bp.route('/', methods=['GET'])
@jwt_required()
def get_all_challenges():
    """Get all challenges for current user."""
    user_id = get_jwt_identity()
    
    challenges = Challenge.query.filter_by(user_id=user_id).order_by(
        Challenge.created_at.desc()
    ).all()
    
    return jsonify({
        'challenges': [c.to_dict() for c in challenges]
    }), 200
