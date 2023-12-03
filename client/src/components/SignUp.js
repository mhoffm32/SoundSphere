import React from "react";
import { useState, useEffect } from "react";
import User from "../User.js";

const SignUp = ({ onSignup }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [nName, setnName] = useState("");
  const [userID, setUserID] = useState(0);
  const [verificationLink, setVerificationLink] = useState("");
  const [localstate, setstate] = useState("signup");
  const [verified, setVerified] = useState(false);
  const [vText, setVText] = useState("");
  const [vCode, setVCode] = useState(0);
  const [vStatus, setvStatus] = useState("Waiting for Verification...");
  const [warningText, setwText] = useState("");

  useEffect(() => {
    if (localstate) {
      let current_user = new User(userID, nName, email, password);
      onSignup({ state: localstate, user: current_user });
    }
  }, [userID]);

  useEffect(() => {
    setstate("signup");
  }, [email]);

  const addUser = async () => {
    const newUser = {
      nName: nName,
      email: email,
      password: password,
    };

    const send = {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Specify the content type as JSON
      },
      body: JSON.stringify(newUser), // Convert the object to a JSON string
    };

    const response = await fetch("/api/users/add-user", send);
    if (response.status === 409) {
      setwText("Account under " + email + " already exists.");
    } else if (response.status === 200) {
    } else {
      setwText("error: " + response);
    }
    return response.json();
  };

  const handleSignup = async () => {
    setwText("");

    if (localstate == "verifying") {
      setwText("Email has not yet been verified. Refreshing link");
      return;
    }

    // Validate login details (you can add your own validation logic here)
    if (email && password && password2 && nName) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setwText("invalid email format");
      } else {
        if (password === password2) {
          const data = await addUser();
          if (data.status == 200) {
            setVerificationLink(data.link);
            setstate("verifying");
          }
        } else {
          setwText("Passwords dont match.");
        }
      }
    } else {
      setwText("Please enter email, first name, last name, password.");
    }
  };

  const verifyEmail = async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setwText("");

    try {
      const response = await fetch(`/api/check-verified/${email}`);
      const data = await response.json();

      if (response.ok) {
        setstate("verified");
        setVerified(true);
        setVText(`Email: ${email} successfully verified. Logging in....`);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setUserID(data.userID);
        setstate("loggedin");
      } else {
        console.error("Verification failed:", data);
        setwText(data.message);
      }
    } catch (error) {
      console.error("Error verifying email:", error.message);
    }
  };

  return (
    <div className="signup">
      <h1 className="general-title">Hero World Account Creation</h1>
      <div className="signup-input">
        <span>
          <div id="s">
            Email:{" "}
            <input
              maxLength="50"
              type="text"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div id="s">
            Username:{" "}
            <input
              maxLength="20"
              type="text"
              id="nName"
              onChange={(e) => setnName(e.target.value)}
            />
          </div>
          <div id="s">
            Password:{" "}
            <input
              type="text"
              id="password"
              maxLength="50"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div id="s">
            Confirm Password:{" "}
            <input
              type="text"
              maxLength="50"
              id="password2"
              onChange={(e) => setPassword2(e.target.value)}
            />
          </div>
        </span>
        <br />
        <button className="submit-btn" id="sbtn" onClick={handleSignup}>
          Sign Up
        </button>
        {warningText != "" ? <p>{warningText}</p> : <></>}
        <br />
        {verificationLink && (
          <div id="vText">
            {localstate == "verifying" ? (
              <>
                <a
                  href={verificationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={verifyEmail}
                >
                  Click here to verify your email
                </a>
                <p>Status: Awaiting Verification....</p>
              </>
            ) : (
              <></>
            )}
            {localstate == "verified" ? (
              <>
                <p>{vText}</p>
              </>
            ) : (
              <></>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUp;
