from flask import Flask
from routes.main_routes import main_routes
from routes.api_routes import api_routes
from models.data_model import db, User
from flask_cors import CORS
from flask_login import LoginManager
from config import Config
from flask_jwt_extended import JWTManager

# Initialize Flask app
app = Flask(__name__)
app.config.from_object(Config)

# Initialize Database
db.init_app(app)

# Initialize Flask-CORS (to allow frontend communication)
CORS(app)
jwt = JWTManager(app)

# Initialize Login Manager
login_manager = LoginManager()
login_manager.init_app(app)

# Define user loader for Flask-Login
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Register Blueprints
app.register_blueprint(main_routes)
app.register_blueprint(api_routes)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Ensure tables are created
    app.run(debug=True)
