from flask import Flask, jsonify, request, session, send_file
from flask_cors import CORS
from pymongo import MongoClient, errors
from dotenv import load_dotenv
import os
from bson import ObjectId
from werkzeug.utils import secure_filename
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
from google_auth_oauthlib.flow import InstalledAppFlow

app = Flask(__name__)
CORS(app, supports_credentials=True)

app.secret_key = os.urandom(24)


load_dotenv()


MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)


db = client.get_database("DB01")
users_collection = db.get_collection("user")
videos_collection = db.get_collection("videos")


CLIENT_SECRETS_FILE = "client_secrets.json"
SCOPES = ["https://www.googleapis.com/auth/youtube.upload"]
API_SERVICE_NAME = "youtube"
API_VERSION = "v3"


def get_authenticated_service():
    flow = InstalledAppFlow.from_client_secrets_file(
        CLIENT_SECRETS_FILE, SCOPES)
    credentials = flow.run_local_server(port=9090)
    return build(API_SERVICE_NAME, API_VERSION, credentials=credentials)


youtube = get_authenticated_service()


try:
    users_collection.create_index([('username', 1)], unique=True)
    users_collection.create_index([('channelId', 1)], unique=True)
except errors.DuplicateKeyError as e:
    print(f"Error creating unique index: {e}")


@app.route('/register', methods=['POST'])
def register_user():
    data = request.json
    new_user = {
        "username": data['username'],
        "password": data['password'],
        "email": data['email'],
        "channelName": data.get('channelName'),
        "channelId": data.get('channelId'),
        "country": data['country'],
        "language": data['language'],
        "type": data['type']
    }
    if new_user["type"] == "video-editor":
        new_user.pop("channelId", None)
        new_user.pop("channelName", None)
    try:
        users_collection.insert_one(new_user)
        return jsonify({'message': 'User registered successfully'}), 201
    except errors.DuplicateKeyError:
        return jsonify({'error': 'Username or channel ID already exists.'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = users_collection.find_one(
        {'username': data['username'], 'password': data['password']})
    if user:
        session['username'] = data['username']
        return jsonify({'message': 'Login successful'}), 200
    else:
        return jsonify({'error': 'Invalid credentials or user type'}), 401


@app.route('/user', methods=['GET'])
def get_user_data():
    username = session.get('username')

    if not username:
        return jsonify({'error': 'User not logged in'}), 401

    user = users_collection.find_one({'username': username}, {
                                     '_id': 0, 'password': 0})

    if user:
        return jsonify({'user': user}), 200
    else:
        return jsonify({'error': 'User not found'}), 404


@app.route('/logout', methods=['POST'])
def logout():
    session.pop('username', None)
    return jsonify({'message': 'Logged out successfully'}), 200


UPLOAD_FOLDER = 'videos'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


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
            'username': request.form['username'],  # Retrieve username from form data
            'title': request.form['title'],
            'description': request.form['description'],
            'tags': request.form['tags'].split(',') if request.form['tags'] else [],
            'filename': filename,
            'channelId': request.form['channelId']
        }
        try:
            videos_collection.insert_one(video_data)
            return jsonify({'message': 'Video uploaded successfully'}), 201
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    else:
        return jsonify({'error': 'Invalid file format'}), 400


# Store modified videos in session storage
@app.route('/modify-video/<video_id>', methods=['PUT'])
def modify_video(video_id):
    try:
        data = request.json
        updated_video_data = {
            'title': data['title'],
            'description': data['description'],
            'tags': data['tags'].split(',') if data['tags'] else [],
        }
        videos_collection.update_one({'_id': ObjectId(video_id)}, {'$set': updated_video_data})
        
        # Store modified video in session storage
        modified_videos = session.get('modified_videos', [])
        modified_videos.append(updated_video_data)
        session['modified_videos'] = modified_videos
        
        return jsonify({'message': 'Video updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Retrieve modified videos from session storage
@app.route('/get-modified-videos', methods=['GET'])
def get_modified_videos():
    modified_videos = session.get('modified_videos', [])
    return jsonify({'modified_videos': modified_videos}), 200


@app.route('/videos-by-channel/<channel_id>', methods=['GET'])
def get_videos_by_channel(channel_id):
    try:
        video_data = videos_collection.find({'channelId': channel_id})
        if video_data:

            video_list = []
            for video in video_data:
                video['_id'] = str(video['_id'])
                video_list.append(video)
            return jsonify(video_list), 200
        else:
            return jsonify({'error': 'No videos found for this channel'}), 404
    except Exception as e:
        print("Error:", e)
        return jsonify({'error': str(e)}), 500


@app.route('/videos/<filename>', methods=['GET'])
def get_video(filename):
    try:
        # Assuming videos are stored in a directory named 'videos'
        return send_file(f'videos/{filename}')
    except Exception as e:
        return str(e), 404  # Return a 404 error if the file is not found

# Define route for declining a video


@app.route('/decline-video/<video_id>', methods=['DELETE'])
def decline_video(video_id):
    try:
        # Delete the video from the database
        result = videos_collection.delete_one({'_id': ObjectId(video_id)})

        if result.deleted_count == 1:
            return jsonify({'message': 'Video declined and deleted successfully'}), 200
        else:
            return jsonify({'error': 'Video not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/upload-to-youtube', methods=['POST'])
def upload_to_youtube():
    try:
        data = request.json
        channel_id = data.get('channelId')
        if not channel_id:
            return jsonify({'error': 'Channel ID is required'}), 400

        video_data = videos_collection.find_one({'channelId': channel_id})
        if not video_data:
            return jsonify({'error': 'Video not found for this channel'}), 404

        body = {
            'snippet': {
                'title': video_data['title'],
                'description': video_data['description'],
                'tags': video_data['tags'],
                'categoryId': '22',
                'channelId': channel_id
            },
            'status': {
                'privacyStatus': 'private'
            }
        }

        media_file = MediaFileUpload(
            os.path.join(app.config['UPLOAD_FOLDER'], video_data['filename']),
            chunksize=-1,
            resumable=True
        )
        response = youtube.videos().insert(
            part='snippet,status',
            body=body,
            media_body=media_file
        ).execute()

        videos_collection.delete_one({'_id': ObjectId(video_data['_id'])})

        youtube_video_id = response.get('id')
        return jsonify({'message': 'Video uploaded to YouTube successfully', 'youtube_video_id': youtube_video_id}), 200
    except KeyError as e:
        return jsonify({'error': f'Missing key in request JSON: {e}'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == "__main__":
    app.run(port=5000, debug=True)
