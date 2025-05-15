import os
import spotipy
from spotipy.oauth2 import SpotifyOAuth
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Set up authentication using environment variables
sp = spotipy.Spotify(auth_manager=SpotifyOAuth(
    client_id=os.getenv("SPOTIFY_CLIENT_ID"),
    client_secret=os.getenv("SPOTIFY_CLIENT_SECRET"),
    redirect_uri=os.getenv("SPOTIFY_REDIRECT_URI"),
    scope="user-library-read"  # Permissions you want to request
))

# The rest of your code remains the same
# Get current user's profile
user = sp.current_user()
print(f"Hello, {user['display_name']}!")

# Search for tracks

results = sp.search(q='artist:Coldplay track:Clocks', type='track')
tracks = results['tracks']['items']
if tracks:
    print(f"Found track: {tracks[0]['name']} by {tracks[0]['artists'][0]['name']}")

# Get user's saved tracks
saved_tracks = sp.current_user_saved_tracks(limit=10)
for item in saved_tracks['items']:
    track = item['track']
    print(f"{track['name']} by {track['artists'][0]['name']}")