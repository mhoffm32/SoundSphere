import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SpotifyProfile() {
  const [user, setUser] = useState(null);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSpotifyData = async () => {
      try {
        // Get user profile
        const userResponse = await axios.get("/api/flask/user", {
          withCredentials: true,
        });
        setUser(userResponse.data);

        // Get top artists
        const artistsResponse = await axios.get("/api/flask/top-artists", {
          withCredentials: true,
          params: { limit: 10 },
        });
        setArtists(artistsResponse.data);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching Spotify data:", error);
        setError("Failed to load Spotify profile. Please connect again.");
        setLoading(false);

        // Redirect if not authenticated
        if (error.response && error.response.status === 401) {
          navigate("/"); // Or wherever your login component is
        }
      }
    };

    fetchSpotifyData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.get("/api/flask/logout", { withCredentials: true });
      navigate("/");
    } catch (error) {
      console.error("Spotify logout error:", error);
    }
  };

  if (loading) return <div className="loading">Loading Spotify profile...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="spotify-profile">
      {user && (
        <div className="user-info">
          {user.image && (
            <img
              src={user.image}
              alt={user.display_name}
              className="profile-image"
            />
          )}
          <h2>{user.display_name}</h2>
          <p>Spotify ID: {user.id}</p>
        </div>
      )}

      <div className="top-artists">
        <h3>Your Top 10 Artists</h3>
        {artists.length > 0 ? (
          <div className="artists-grid">
            {artists.map((artist) => (
              <div key={artist.id} className="artist-card">
                {artist.image && <img src={artist.image} alt={artist.name} />}
                <h4>{artist.name}</h4>
                <p className="genres">{artist.genres.slice(0, 2).join(", ")}</p>
                <a
                  href={artist.spotify_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open in Spotify
                </a>
              </div>
            ))}
          </div>
        ) : (
          <p>No top artists found</p>
        )}
      </div>

      <button onClick={handleLogout} className="logout-btn">
        Disconnect Spotify
      </button>
    </div>
  );
}

export default SpotifyProfile;
