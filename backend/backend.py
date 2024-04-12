from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
import os
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
from google_auth_oauthlib.flow import InstalledAppFlow

app = Flask(__name__)
CORS(app)

# Load environment variables from .env file
load_dotenv()

# Mock video upload folder
UPLOAD_FOLDER = 'videos'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# YouTube API credentials
CLIENT_SECRETS_FILE = "client_secret.json"
SCOPES = ["https://www.googleapis.com/auth/youtube.upload"]
API_SERVICE_NAME = "youtube"
API_VERSION = "v3"

def get_authenticated_service():
    flow = InstalledAppFlow.from_client_secrets_file(CLIENT_SECRETS_FILE, SCOPES)
    credentials = flow.run_console()
    return build(API_SERVICE_NAME, API_VERSION, credentials=credentials)

youtube = get_authenticated_service()

@app.route('/upload-to-youtube', methods=['POST'])
def upload_to_youtube():
    data = request.json

    # Video details from frontend
    video_title = data['title']
    video_description = data['description']
    video_tags = data['tags']
    video_file_path = os.path.join(app.config['UPLOAD_FOLDER'], data['video']['name'])

    try:
        # Upload video to YouTube
        request_body = {
            'snippet': {
                'title': video_title,
                'description': video_description,
                'tags': video_tags.split(','),
                'categoryId': '22'  # Sample category ID (Entertainment)
            },
            'status': {
                'privacyStatus': 'private'  # Sample privacy status
            }
        }

        media_file = MediaFileUpload(video_file_path, chunksize=-1, resumable=True)
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
