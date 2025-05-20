import React, { useState } from "react";
import axios from "axios";

const baseUrl = process.env.REACT_APP_FLASK_BASE_URL;

function SpotifyLogin() {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/flask/login`);
      const response = await res.json();

      console.log(response.auth_url);

      window.location.href = response.auth_url;
    } catch (error) {
      console.error("Error during Spotify login:", error);
      setLoading(false);
    }
  };

  return (
    <div className="spotify-login">
      <h2>Connect Your Spotify Account</h2>
      <p>Discover insights about your music preferences</p>
      <button
        onClick={handleLogin}
        disabled={loading}
        className="spotify-button"
      >
        {loading ? "Connecting..." : "Connect with Spotify"}
      </button>
    </div>
  );
}

export default SpotifyLogin;
