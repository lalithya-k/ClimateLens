from flask import Blueprint, request, jsonify
from models.data_model import db, User, Country, Indicator, ClimateData
from flask_login import login_user, logout_user
import requests
from flask_bcrypt import generate_password_hash, check_password_hash
from config import Config
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

api_routes = Blueprint('api_routes', __name__)

# ===================== User Authentication ===================== #

# Register a new user
@api_routes.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if User.query.filter_by(email=email).first():
        return jsonify({"success": False, "message": "Email already registered"}), 400

    hashed_password = generate_password_hash(password).decode("utf-8")
    new_user = User(email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"success": True, "message": "User registered successfully"})

# Login with email and password
@api_routes.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()

    if user and check_password_hash(user.password, password):
        access_token = create_access_token(identity=user.id)
        return jsonify({
            "success": True,
            "user": {"email": user.email, "name": user.name},
            "access_token": access_token
        })
    else:
        return jsonify({"success": False, "message": "Invalid credentials"}), 401

# Protected Route Example
@api_routes.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if user:
        return jsonify({"message": "Access granted", "user": {"email": user.email, "name": user.name}})
    return jsonify({"message": "User not found"}), 404

# ===================== Google OAuth 2.0 Authentication ===================== #

@api_routes.route('/auth/google', methods=['GET'])
def google_login():
    google_auth_url = (
        "https://accounts.google.com/o/oauth2/auth"
        "?response_type=code"
        f"&client_id={Config.GOOGLE_CLIENT_ID}"
        f"&redirect_uri={Config.GOOGLE_REDIRECT_URI}"
        "&scope=email profile"
    )
    return jsonify({"url": google_auth_url})

@api_routes.route('/auth/callback', methods=['GET'])
def google_callback():
    code = request.args.get('code')

    token_url = "https://oauth2.googleapis.com/token"
    token_data = {
        "code": code,
        "client_id": Config.GOOGLE_CLIENT_ID,
        "client_secret": Config.GOOGLE_CLIENT_SECRET,
        "redirect_uri": Config.GOOGLE_REDIRECT_URI,
        "grant_type": "authorization_code",
    }
    token_response = requests.post(token_url, data=token_data).json()

    access_token = token_response.get("access_token")
    if not access_token:
        return jsonify({"error": "Failed to obtain access token"}), 400

    user_info_url = "https://www.googleapis.com/oauth2/v2/userinfo"
    headers = {"Authorization": f"Bearer {access_token}"}
    user_info = requests.get(user_info_url, headers=headers).json()

    user = User.query.filter_by(email=user_info["email"]).first()
    if not user:
        user = User(email=user_info["email"], google_id=user_info["id"], name=user_info["name"],
                    profile_pic=user_info["picture"])
        db.session.add(user)
        db.session.commit()

    login_user(user)
    return jsonify({
        "message": "Google login successful",
        "user": {"name": user.name, "email": user.email, "profile_pic": user.profile_pic}
    })
