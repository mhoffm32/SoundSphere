import os
from flask import Flask, request, redirect, session, url_for, jsonify
import spotipy
from spotipy.oauth2 import SpotifyOAuth
from dotenv import load_dotenv
from flask_cors import CORS
from flask_session import Session
import redis

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Updated FRONTEND URL to match Spotify's allowed domains
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://127.0.0.1:3000")

# CORS allows requests from your React frontend at 127.0.0.1
CORS(app, origins=["http://127.0.0.1:3000", "http://localhost:4000", "http://localhost:3000",], supports_credentials=True)

@app.before_request
def log_request_info():
    print("==== Incoming Request ====")
    print(f"Method: {request.method}")
    print(f"Path: {request.path}")
    print(f"Headers:\n{dict(request.headers)}")
    print(f"Query Params: {request.args}")
    if request.method in ['POST', 'PUT', 'PATCH']:
        print(f"Body: {request.get_data(as_text=True)}")
    print("==========================")


app.secret_key = os.getenv("SECRET_KEY", os.urandom(24).hex())

app.config["SESSION_TYPE"] = "redis"
app.config["SESSION_REDIS"] = redis.from_url(os.getenv("REDIS_URL", "redis://localhost:6379"))
Session(app)

def create_spotify_oauth():
    return SpotifyOAuth(
        client_id=os.getenv("SPOTIFY_CLIENT_ID"),
        client_secret=os.getenv("SPOTIFY_CLIENT_SECRET"),
        redirect_uri="http://127.0.0.1:4000/api/flask/callback",  # must match Spotify dashboard
        scope="user-library-read user-read-private user-top-read"
     )

@app.route("/login", methods=["GET"])
def login():
    print("Login endpoint called")
    sp_oauth = create_spotify_oauth()
    auth_url = sp_oauth.get_authorize_url()
    #print(jsonify({"auth_url": auth_url}).data)
    return jsonify({"auth_url": auth_url})







@app.route("/is-authenticated")
def is_authenticated():
    access_token = session.get("access_token")
    return jsonify({"authenticated": bool(access_token)})



# @app.route("/login", methods=["GET"])
# def login():
#     return "Login endpoint reached!"

@app.route('/callback')
def callback():
    sp_oauth = create_spotify_oauth()
    code = request.args.get('code')

    token_info = sp_oauth.get_access_token(code)
    session["token_info"] = token_info

    return redirect(f"{FRONTEND_URL}/profile")



# @app.route('/user')
# def get_user():
#     token_info = session.get("token_info", None)
#     if not token_info:
#         return jsonify({"error": "Not authenticated"}), 401

#     sp_oauth = create_spotify_oauth()
#     if sp_oauth.is_token_expired(token_info):
#         token_info = sp_oauth.refresh_access_token(token_info['refresh_token'])
#         session["token_info"] = token_info

#     sp = spotipy.Spotify(auth=token_info['access_token'])
#     user_profile = sp.current_user()

#     return jsonify({
#         "display_name": user_profile['display_name'],
#         "id": user_profile['id'],
#         "email": user_profile.get('email'),
#         "image": user_profile.get('images', [{}])[0].get('url') if user_profile.get('images') else None
#     })


@app.route("/user")
def get_user():
    token_info = session.get("token_info")
    if not token_info:
        return jsonify({"error": "unauthorized"}), 401

    sp_oauth = create_spotify_oauth()
    if sp_oauth.is_token_expired(token_info):
        token_info = sp_oauth.refresh_access_token(token_info['refresh_token'])
        session["token_info"] = token_info

    sp = spotipy.Spotify(auth=token_info['access_token'])
    user_profile = sp.current_user()

    return jsonify({
        "display_name": user_profile['display_name'],
        "id": user_profile['id'],
        "email": user_profile.get('email'),
        "image": user_profile.get('images', [{}])[0].get('url') if user_profile.get('images') else None
    })



@app.route('/top-artists')
def get_top_artists():
    token_info = session.get("token_info", None)
    if not token_info:
        return jsonify({"error": "Not authenticated"}), 401

    sp_oauth = create_spotify_oauth()
    if sp_oauth.is_token_expired(token_info):
        token_info = sp_oauth.refresh_access_token(token_info['refresh_token'])
        session["token_info"] = token_info

    sp = spotipy.Spotify(auth=token_info['access_token'])

    time_range = request.args.get('time_range', 'medium_term')
    limit = int(request.args.get('limit', 10))

    top_artists_data = sp.current_user_top_artists(limit=limit, time_range=time_range)

    top_artists = []
    for artist in top_artists_data['items']:
        top_artists.append({
            'name': artist['name'],
            'id': artist['id'],
            'genres': artist['genres'],
            'popularity': artist['popularity'],
            'image': artist['images'][0]['url'] if artist['images'] else None,
            'spotify_url': artist['external_urls']['spotify']
        })

    return jsonify(top_artists)

@app.route('/logout')
def logout():
    session.clear()
    return jsonify({"message": "Logged out successfully"})

@app.route('/health')
def health_check():
    return jsonify({"status": "Flask Spotify service is healthy"})

if __name__ == '__main__':
    app.run(debug=True, port=5002, host='0.0.0.0')
