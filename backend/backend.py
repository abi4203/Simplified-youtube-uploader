from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow Cross-Origin Resource Sharing (CORS) for development purposes

# Sample data for demonstration
videos = [
    {"video_id": 1, "title": "Sample Video 1", "description": "Description 1", "tags": ["tag1", "tag2"]},
    {"video_id": 2, "title": "Sample Video 2", "description": "Description 2", "tags": ["tag3", "tag4"]}
]

@app.route('/videos', methods=['GET'])
def get_videos():
    return jsonify(videos)

@app.route('/videos', methods=['POST'])
def add_video():
    new_video = request.json
    videos.append(new_video)
    return jsonify({"message": "Video added successfully"}), 201

if __name__ == '__main__':
    app.run(debug=True)
