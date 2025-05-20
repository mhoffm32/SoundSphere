import React, { useState } from "react";
import axios from "axios";

function SpotifyLogin() {
  const [loading, setLoading] = useState(false);
  console.log("URL");

  const handleLogin = async () => {
    console.log("URL");
    setLoading(true);
    try {
      //const response = await axios.get(`${baseUrl}/flask/login`);
      window.location.href = response.data.auth_url;
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
