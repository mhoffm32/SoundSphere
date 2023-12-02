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
          <button
            onClick={() => {
              state == "home" ? setState("manage") : setState("home");
            }}
          >
            {state == "home" ? <>Manage Account</> : <>Return</>}
          </button>
          {state == "home" ? (
            <>
              <h2>{user.nName}'s Hero Search</h2>
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
                  maxlength="50"
                  type="text"
                  id="oldPass"
                  onChange={(e) => setOldPass(e.target.value)}
                />
                New Password:{" "}
                <input
                  maxlength="50"
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
