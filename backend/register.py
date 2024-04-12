from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient, errors
from dotenv import load_dotenv
import os

app = Flask(__name__)
CORS(app)

# Load environment variables from .env file
load_dotenv()

# MongoDB connection string from .env file
MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)

# Specify the database and collection
db = client.get_database("DB01")
users_collection = db.get_collection("user")

# Create unique indexes on 'username' and 'email' fields
try:
    users_collection.create_index([('username', 1)], unique=True)
    users_collection.create_index([('channelId', 1)], unique=True)
except errors.DuplicateKeyError as e:
    print(f"Error creating unique index: {e}")

# Register User endpoint
@app.route('/register', methods=['POST'])
def register_user():
    data = request.json
    new_user = {
        "username": data['username'],
        "password": data['password'],
        "email": data['email'],
        "channelName": data['channelName'],
        "channelId": data['channelId'],
        "country": data['country'],
        "language": data['language']
    }
    try:
        users_collection.insert_one(new_user)
        return jsonify({'message': 'User registered successfully'}), 201
    except errors.DuplicateKeyError:
        return jsonify({'error': 'Username or channel ID already exists.'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
