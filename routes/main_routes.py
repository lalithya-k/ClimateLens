from flask import Blueprint
from models.data_model import Country
from flask import jsonify
main_routes = Blueprint('main_routes', __name__)

@main_routes.route('/')
def home():
    return {"message": "Welcome to Climate Lens"}


