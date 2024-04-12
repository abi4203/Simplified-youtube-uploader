from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient, errors
from dotenv import load_dotenv
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

# Load environment variables from .env file
load_dotenv()


# MongoDB connection string from .env file
MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)

# Specify the database and collections
db = client.get_database("DB01")
users_collection = db.get_collection("user")
videos_collection = db.get_collection("videos")

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
     
# Create a directory for uploading videos
UPLOAD_FOLDER = 'videos'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Upload Video endpoint
@app.route('/upload-video', methods=['POST'])
def upload_video():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400
    
    video_file = request.files['file']
    
    if video_file.filename == '':
        return jsonify({'error': 'No selected video file'}), 400
    
    if video_file:
        filename = secure_filename(video_file.filename)
        video_file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        video_data = {
            'title': request.form['title'],
            'description': request.form['description'],
            'tags': request.form['tags'].split(',') if request.form['tags'] else [],
            'filename': filename
        }
        try:
            videos_collection.insert_one(video_data)
            return jsonify({'message': 'Video uploaded successfully'}), 201
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    else:
        return jsonify({'error': 'Invalid file format'}), 400

if __name__ == '__main__':
    app.run(debug=True)
