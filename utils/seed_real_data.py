import pandas as pd
from app import app
from models.data_model import db, ClimateData, Country, Indicator

# Load the combined dataset
data_file = r'C:/Users/Lalithya Koneti/Downloads/ClimateLens/combined_climate_dataset.csv'

# Function to seed data into the database
def seed_data():
    with app.app_context():
        # Load data into a DataFrame
        data = pd.read_csv(data_file)

        # Populate Country Table
        countries_added = set()
        for _, row in data.iterrows():
            if row['ISO3'] not in countries_added:
                country = Country(
                    name=row['Country'],
                    iso3=row['ISO3'],
                    sub_region=row['Sub-Region'],
                    income_group=row['Income Group'],
                    area=row['Area (KM²)'],
                    density=row['Density (KM²)']
                )
                db.session.add(country)
                countries_added.add(row['ISO3'])

        # Populate Indicator Table
        indicators_added = set()
        for _, row in data.iterrows():
            if row['Indicator'] not in indicators_added:
                indicator = Indicator(
                    name=row['Indicator'],
                    unit=row['Unit'],
                    source=row['Source']
                )
                db.session.add(indicator)
                indicators_added.add(row['Indicator'])

        # Commit the above additions to assign IDs
        db.session.commit()

        # Map ISO3 and Indicator names to their IDs
        country_map = {c.iso3: c.id for c in Country.query.all()}
        indicator_map = {i.name: i.id for i in Indicator.query.all()}

        # Populate ClimateData Table
        for _, row in data.iterrows():
            climate_data = ClimateData(
                country_id=country_map.get(row['ISO3']),
                indicator_id=indicator_map.get(row['Indicator']),
                year=row['Year'],
                value=row['Value'],
                co2_emissions=row['CO2_Emissions']
            )
            db.session.add(climate_data)

        # Commit all data to the database
        db.session.commit()
        print("Real data successfully loaded into the database.")

if __name__ == '__main__':
    seed_data()
