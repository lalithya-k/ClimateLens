from app import app
from models.data_model import db, ClimateData, Country, Indicator

with app.app_context():
    # Clear existing data
    db.session.query(ClimateData).delete()
    db.session.query(Indicator).delete()
    db.session.query(Country).delete()

    db.session.commit()
    print("All dummy data has been cleared.")
