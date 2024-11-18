from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

facilities_data = {
    "mining": [
        {"id": "mine1", "name": "Greenbushes", "company": "Albemarle", "country": "Australia", "capacity": 1000000, "emissions": 45},
        {"id": "mine2", "name": "Atacama", "company": "SQM", "country": "Chile", "capacity": 800000, "emissions": 40},
        {"id": "mine3", "name": "Silver Peak", "company": "Albemarle", "country": "USA", "capacity": 500000, "emissions": 35},
    ],
    "processing": [
        {"id": "proc1", "name": "Jiangxi Plant", "company": "Ganfeng", "country": "China", "capacity": 900000, "emissions": 30},
        {"id": "proc2", "name": "Sichuan Plant", "company": "Tianqi", "country": "China", "capacity": 850000, "emissions": 32},
        {"id": "proc3", "name": "Antofagasta Plant", "company": "SQM", "country": "Chile", "capacity": 600000, "emissions": 28},
    ],
    "cathode": [
        {"id": "cath1", "name": "Umicore Brussels", "company": "Umicore", "country": "Belgium", "capacity": 700000, "emissions": 25},
        {"id": "cath2", "name": "BASF Michigan", "company": "BASF", "country": "USA", "capacity": 650000, "emissions": 23},
        {"id": "cath3", "name": "LG Chem Ochang", "company": "LG Chem", "country": "South Korea", "capacity": 800000, "emissions": 27},
    ],
    "cell": [
        {"id": "cell1", "name": "Gigafactory Nevada", "company": "Tesla/Panasonic", "country": "USA", "capacity": 950000, "emissions": 20},
        {"id": "cell2", "name": "LG Poland", "company": "LG Energy", "country": "Poland", "capacity": 850000, "emissions": 22},
        {"id": "cell3", "name": "CATL Ningde", "company": "CATL", "country": "China", "capacity": 1200000, "emissions": 25},
    ]
}


@app.route('/api/facilities', methods=['GET'])
def get_facilities():
    return jsonify(facilities_data)

if __name__ == '__main__':
    app.run(debug=True, port=5000)