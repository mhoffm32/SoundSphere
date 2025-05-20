import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate(); // 👈 Hook to programmatically navigate

  const handleLoginClick = () => {
    navigate("/spotify"); // 👈 Go to /spotify route
  };

  return (
    <div>
      <h1>Welcome to SoundSphere</h1>
      <button onClick={handleLoginClick}>Login with Spotify</button>
    </div>
  );
};

export default Home;
