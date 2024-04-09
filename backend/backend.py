import googleapiclient.discovery

# Your API key
API_KEY = 'YOUR_API_KEY'

# Create a YouTube API client
youtube = googleapiclient.discovery.build('youtube', 'v3', developerKey=API_KEY)

def get_channel_info(channel_id):
    request = youtube.channels().list(
        part="snippet",
        id=channel_id
    )
    response = request.execute()
    
    if 'items' in response:
        channel = response['items'][0]
        channel_id = channel['id']
        channel_title = channel['snippet']['title']
        channel_description = channel['snippet']['description']
        
        print("Channel ID:", channel_id)
        print("Channel Title:", channel_title)
        print("Channel Description:", channel_description)
    else:
        print("Channel not found.")

# Example channel ID (replace with the desired channel ID)
channel_id = 'UC_x5XG1OV2P6uZZ5FSM9Ttw'

# Call the function to get channel information
get_channel_info(channel_id)
