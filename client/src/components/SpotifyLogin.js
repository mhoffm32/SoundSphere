import React, { useState } from "react";
import axios from "axios";

const baseUrl = process.env.REACT_APP_FLASK_BASE_URL;

function SpotifyLogin() {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://127.0.0.1:5000/api/login", {
        withCredentials: true,
      });

      console.log(response);

      //window.location.href = response.data.auth_url;
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
