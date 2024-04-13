from flask import Flask, jsonify, request, session
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
import os

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.secret_key = os.urandom(24)

# Load environment variables from .env file
load_dotenv()

# MongoDB connection string from .env file
MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)

# Specify the database and collections
db = client.get_database("DB01")
users_collection = db.get_collection("user")
videos_collection = db.get_collection("videos")

# Login endpoint
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = users_collection.find_one({'username': data['username'], 'password': data['password']})

    if user:
        session['username'] = data['username']
        print("Session after login:", session)
        return jsonify({'message': 'Login successful'}), 200
    else:
        return jsonify({'error': 'Invalid credentials'}), 401

# User data endpoint
@app.route('/user', methods=['GET'])
def get_user_data():
    username = session.get('username')
    print("Session in get_user_data:", session)

    if not username:
        return jsonify({'error': 'User not logged in'}), 401

    user = users_collection.find_one({'username': username}, {'_id': 0, 'password': 0})

    if user:
        return jsonify({'user': user}), 200
    else:
        return jsonify({'error': 'User not found'}), 404

# Debug session endpoint
@app.route('/debug_session', methods=['GET'])
def debug_session():
    return jsonify(dict(session))

if __name__ == '__main__':
    app.run(debug=True)
