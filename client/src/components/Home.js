import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate(); // 👈 Hook to programmatically navigate
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState();

  // const handleLoginClick = () => {
  //   navigate("/spotify"); // 👈 Go to /spotify route
  // };

  // useEffect(() => {
  //   handleLogin();
  // }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Try to get user info

        const res = await axios.get("/api/flask/user", {
          withCredentials: true,
        });
        console.log(res.data);
        setUser(res.data); // Authenticated ✅
      } catch (err) {
        if (err.response?.status === 401) {
          // Not authenticated → redirect to login flow
          const loginRes = await axios.get("/api/flask/login", {
            withCredentials: true,
          });
          window.location.href = loginRes.data.auth_url;
        } else {
          console.error("Error:", err);
        }
      }
    };

    checkAuth();
  }, []);

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
    <div>
      <h1>Welcome to SoundSphere</h1>
      <button onClick={() => {}}>Login with Spotify</button>
    </div>
  );
};

export default Home;
