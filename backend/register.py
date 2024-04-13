from flask import Flask, jsonify, request, session
from flask_cors import CORS
from pymongo import MongoClient, errors
from dotenv import load_dotenv
import os
from werkzeug.utils import secure_filename
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
from google_auth_oauthlib.flow import InstalledAppFlow

app = Flask(__name__)
CORS(app, supports_credentials=True)  # Allow credentials

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

# YouTube API credentials
CLIENT_SECRETS_FILE = "client_secret.json"
SCOPES = ["https://www.googleapis.com/auth/youtube.upload"]
API_SERVICE_NAME = "youtube"
API_VERSION = "v3"

# Helper function to authenticate with YouTube API
def get_authenticated_service():
    flow = InstalledAppFlow.from_client_secrets_file(
        CLIENT_SECRETS_FILE, SCOPES)
    credentials = flow.run_local_server(port=9090)
    return build(API_SERVICE_NAME, API_VERSION, credentials=credentials)

youtube = get_authenticated_service()

# Create unique indexes on 'username' and 'channelId' fields
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
        # Allow channelName to be optional
        "channelName": data.get('channelName'),
        # Allow channelId to be optional
        "channelId": data.get('channelId'),
        "country": data['country'],
        "language": data['language'],
        "type": data['type']
    }
    try:
        users_collection.insert_one(new_user)
        return jsonify({'message': 'User registered successfully'}), 201
    except errors.DuplicateKeyError:
        return jsonify({'error': 'Username or channel ID already exists.'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

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
        return jsonify({'error': 'Invalid credentials or user type'}), 401

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

# Logout endpoint
@app.route('/logout', methods=['POST'])
def logout():
    session.pop('username', None)
    return jsonify({'message': 'Logged out successfully'}), 200

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
            'filename': filename,
            # Add channelId to video data
            'channelId': request.form['channelId']
        }
        try:
            videos_collection.insert_one(video_data)
            return jsonify({'message': 'Video uploaded successfully'}), 201
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    else:
        return jsonify({'error': 'Invalid file format'}), 400

# get-video-details based on channel ID
@app.route('/get-video-details-by-channel/<channel_id>', methods=['GET'])
def get_video_details_by_channel(channel_id):
    try:
        video_data = videos_collection.find({'channelId': channel_id})
        if video_data:
            # Assuming you want to return a list of videos
            video_list = list(video_data)
            return jsonify(video_list), 200
        else:
            return jsonify({'error': 'No videos found for this channel'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Upload to YouTube endpoint
@app.route('/upload-to-youtube', methods=['POST'])
def upload_to_youtube():
    data = request.json

    # Video details from frontend
    video_title = data['title']
    video_description = data['description']
    video_tags = data['tags']
    video_file_path = os.path.join(
        app.config['UPLOAD_FOLDER'], data['filename'])
    channel_id = data['channelId']

    try:
        # Upload video to YouTube
        request_body = {
            'snippet': {
                'title': video_title,
                'description': video_description,
                'tags': video_tags.split(','),
                'categoryId': '22',  # Sample category ID (Entertainment)
                'channelId': channel_id  # Specify the target channel's ID
            },
            'status': {
                'privacyStatus': 'private'  # Sample privacy status
            }
        }

        media_file = MediaFileUpload(
            video_file_path, chunksize=-1, resumable=True)
        response = youtube.videos().insert(
            part='snippet,status',
            body=request_body,
            media_body=media_file
        ).execute()

        # If successful, return the YouTube video ID
        youtube_video_id = response.get('id')
        return jsonify({'message': 'Video uploaded to YouTube successfully', 'youtube_video_id': youtube_video_id}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
