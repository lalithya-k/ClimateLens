import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'Saibaba@321')
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    SQLALCHEMY_DATABASE_URI = f"sqlite:///{os.path.join(BASE_DIR, 'climate_lens.db')}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "supersecretjwtkey")

    # Google OAuth Config
    GOOGLE_CLIENT_ID = "48914486228-t0l4md4aiol9u5hd7s7v7ddf0mfec4k1.apps.googleusercontent.com"
    GOOGLE_CLIENT_SECRET = "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"
    GOOGLE_REDIRECT_URI = "http://127.0.0.1:5000/auth/callback"