import React from "react";
import { useState, useEffect } from "react";
import UnauthHome from "./UnauthHome";
import { useAuth } from "../AuthContext";

const Home = (props) => {
  const user = props.user;
  const [state, setState] = useState("home");
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [warningText, setWarning] = useState("");
  const { token, setToken } = useAuth();

  const changePass = async () => {
    setWarning("");
    if (oldPass && newPass) {
      const response = await fetch(
        `/api/users/change-pass/${user.id}/${oldPass}/${newPass}`,
        {
          method: "GET",
          headers: {
            Authorization: token,
          },
        }
      );
      const data = await response.json();
      if (data.status !== 200) {
        setWarning(data.message);
      } else {
        setWarning("Password Successfully changed.");
      }
    } else {
      setWarning("Please enter both current password and new.");
    }
  };

  return (
    <div>
      {user ? (
        <div>
          <div className="manage-box">
            <button
              id="acc-btn"
              onClick={() => {
                state == "home" ? setState("manage") : setState("home");
              }}
              style={{
                backgroundColor: state === "manage" ? "rgb(20,204,204)" : "",
                fontWeight: state === "manage" ? "bold" : "normal",
              }}
            >
              {state == "home" ? <>Manage Account</> : <>Return</>}
            </button>
          </div>
          {state == "home" ? (
            <>
              <h2>{user.nName}'s HeroWorld</h2>
              <UnauthHome user={user} />
            </>
          ) : (
            <>
              <p>User ID: {user.id} </p>
              <p>Nickname: {user.nName}</p>
              <p>User Email: {user.email}</p>
              <br />
              <span>
                Current Password:{" "}
                <input
                  maxLength="50"
                  type="text"
                  id="oldPass"
                  onChange={(e) => setOldPass(e.target.value)}
                />
                New Password:{" "}
                <input
                  maxLength="50"
                  type="text"
                  id="newPass"
                  onChange={(e) => setNewPass(e.target.value)}
                />
              </span>
              <button onClick={changePass}>Change Password</button>
              <p>{warningText}</p>
            </>
          )}
        </div>
      ) : (
        <p>User is undefined</p>
      )}
    </div>
  );
};

export default Home;
