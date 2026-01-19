from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from api.models import db, User

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user."""
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    
    if not all([name, email, password]):
        return jsonify({'error': 'Name, email, and password are required'}), 400
    
    if len(password) < 6:
        return jsonify({'error': 'Password must be at least 6 characters'}), 400
    
    # Check if email exists
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({'error': 'Email already registered'}), 409
    
    # Create user
    user = User(name=name, email=email, role='user')
    user.set_password(password)
    
    db.session.add(user)
    db.session.commit()
    
    # Generate token
    access_token = create_access_token(
        identity=str(user.id),
        additional_claims={
            'email': user.email,
            'role': user.role
        }
    )
    
    return jsonify({
        'message': 'User registered successfully',
        'user': user.to_dict(),
        'token': access_token
    }), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    """Login and get JWT token."""
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    email = data.get('email')
    password = data.get('password')
    
    if not all([email, password]):
        return jsonify({'error': 'Email and password are required'}), 400
    
    user = User.query.filter_by(email=email).first()
    
    if not user or not user.check_password(password):
        return jsonify({'error': 'Invalid email or password'}), 401
    
    access_token = create_access_token(
        identity=str(user.id),
        additional_claims={
            'email': user.email,
            'role': user.role
        }
    )
    
    return jsonify({
        'message': 'Login successful',
        'user': user.to_dict(),
        'token': access_token
    }), 200


@auth_bp.route('/me', methods=['GET'])
def get_me():
    """Get current user (requires token in subsequent implementation)."""
    from flask_jwt_extended import jwt_required, get_jwt_identity
    
    @jwt_required()
    def inner():
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        return jsonify({'user': user.to_dict()}), 200
    
    return inner()
