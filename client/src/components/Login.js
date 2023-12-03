import React from "react";
import { useState, useEffect } from "react";
import User from "../User.js";
import { useAuth } from "../AuthContext";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localstate, setstate] = useState("login");
  const [curr_user, setUser] = useState(new User(0, "", "", ""));
  const { token, setToken } = useAuth();
  const [warningText, setWarning] = useState("");

  useEffect(() => {
    if (localstate) {
      onLogin({ state: localstate, user: curr_user });
    }
  }, [localstate]);

  const handleLog = async () => {
    setWarning("");
    if (email && password) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {
        setWarning("invalid email format");
      } else {
        let data = await getUser();
        let usr = data.user;
        if (data.status !== 200) {
          setWarning(data.message);
        } else {
          if (usr.disabled) {
            setWarning(
              "Disabled Account. Please contact accounts@heroworld.com for more details."
            );
          } else {
            let u = new User(usr.userID, usr.nName, usr.email, usr.password);
            u.admin = usr.admin;
            setUser(u);
            setToken(data.token);
            setstate("loggedin");
          }
        }
      }
    } else if (!email && !password) {
      setWarning("Please enter both an email and password");
    } else if (!password && email) {
      setWarning("Please enter an password.");
    } else if (!email && password) {
      setWarning("Please enter an email.");
    }
  };

  async function getUser() {
    try {
      const response = await fetch(`/api/users/get_user/${email}/${password}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error occured:", error);
      return null; // or handle the error in a way that makes sense for your application
    }
  }

  return (
    <div className="login">
      <h1 className="general-title">HeroWorld Login</h1>
      <div className="l-input">
        <span>
          <div id="l">
            Email:{" "}
            <input
              type="text"
              id="email"
              maxLength="50"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div id="l">
            Password:{" "}
            <input
              type="text"
              maxLength="50"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </span>
        <br />
        <button className="submit-btn" onClick={handleLog}>
          Login
        </button>
      </div>
      <p>{warningText}</p>
    </div>
  );
};

export default Login;
