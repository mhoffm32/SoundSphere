import { useState, useEffect } from "react";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Info from "./components/Info";
import Home from "./components/Home";
import AdminHome from "./components/AdminHome";
import User from "./User";
import "./App.css";
import { useAuth } from "./AuthContext";
import { jwtDecode } from "jwt-decode";

//Page header will change to login/logout and site info
function App() {
  const [state, setState] = useState("info");
  const [current_user, setCurrentUser] = useState(null);
  const [userType, setUserType] = useState("");
  const [manageText, setManageText] = useState("Manage Account");
  const [pState, setPState] = useState("");
  const [state2, setState2] = useState("");
  const { token, setToken } = useAuth();
  const { priv } = useAuth();
  const { dcma } = useAuth();
  const { use } = useAuth();
  const [lastState, setLastState] = useState("");
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [warningText, setWarning] = useState("");

  let loginText = "Log In";

  if (state == "loggedin" || state == "manage") {
    loginText = "Log Out";
  }
  useEffect(() => {
    setWarning("");
  }, [state]);

  const handleState = (state1) => {
    setState(state1);
  };

  const getUse = () => {
    setLastState(state);

    setState("policies");
    setPState("use");
  };

  const getDCMA = () => {
    setLastState(state);
    setState("policies");
    setPState("dcma");
  };
  const getSecurity = () => {
    setLastState(state);
    setState("policies");
    setPState("security");
  };

  function onLoginClick() {
    if (state == "loggedin" || state == "manage") {
      setState("info");
      loginText = "Log In";
      setCurrentUser(null);
      setToken(null);
    } else {
      setState("login");
      loginText = "Log Out";
    }
  }

  const changePass = async () => {
    setWarning("");
    if (oldPass && newPass) {
      const response = await fetch(
        `/api/users/change-pass/${current_user.id}/${oldPass}/${newPass}`,
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

  const handleLogin = (res) => {
    console.log("Handling login \n");
    setState(res.state);
    setCurrentUser(res.user);
    if (res.user.admin) {
      setUserType("admin");
    } else {
      setUserType("general");
    }
  };

  const returnPage = () => {
    setState("info");
  };

  return (
    <div className="outter">
      <div id="content">
        {state == "policies" ? (
          <>
            <button onClick={() => setState(lastState)}>Return</button>
            {pState == "use" ? (
              <>
                <h1>Acceptable Use Policy</h1>
                <p>
                  {use.split("\n").map((line, index) => (
                    <span key={index}>
                      {line}
                      <br />
                    </span>
                  ))}
                </p>
              </>
            ) : (
              <></>
            )}
            {pState == "dcma" ? (
              <>
                <h1>DMCA notice & takedown policy</h1>
                <p>
                  {dcma.split("\n").map((line, index) => (
                    <span key={index}>
                      {line}
                      <br />
                    </span>
                  ))}
                </p>
              </>
            ) : (
              <></>
            )}
            {pState == "security" ? (
              <>
                <h1>Security & Privacy policy</h1>
                <p>
                  {priv.split("\n").map((line, index) => (
                    <span key={index}>
                      {line}
                      <br />
                    </span>
                  ))}
                </p>
              </>
            ) : (
              <></>
            )}
          </>
        ) : (
          <></>
        )}

        {state != "login" && state != "policies" ? (
          <div className="login-btn-top">
            <button
              onClick={onLoginClick}
              style={{
                backgroundColor:
                  state === "loggedin" || state == "manage"
                    ? "rgb(200, 200, 200)"
                    : "rgb(129, 199, 146)",
                fontWeight: state === "login" ? "bold" : "bold",
                marginRight: "1em",
              }}
            >
              {loginText}
            </button>
            {state === "loggedin" || state === "manage" ? (
              <>
                <button
                  onClick={() => {
                    state == "loggedin"
                      ? setState("manage")
                      : setState("loggedin");
                  }}
                  style={{
                    backgroundColor: "rgb(200, 100, 200)",
                    fontWeight: state === "login" ? "bold" : "bold",
                    marginRight: "1em",
                  }}
                >
                  {state == "loggedin" ? <>Manage Account</> : <>Return</>}
                </button>
                {state == "manage" ? (
                  <div id="managePass">
                    <p>User ID: {current_user.id} </p>
                    <p>Nickname: {current_user.nName}</p>
                    <p>User Email: {current_user.email}</p>
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
                    <button
                      style={{
                        backgroundColor: "rgb(200, 200, 200)",
                        fontWeight: state === "login" ? "bold" : "bold",
                        marginRight: "1em",
                      }}
                      onClick={changePass}
                    >
                      Change Password
                    </button>
                    <p>{warningText}</p>
                  </div>
                ) : (
                  <></>
                )}
              </>
            ) : (
              <></>
            )}

            {current_user !== null &&
            current_user.id !== 0 &&
            state != "manage" ? (
              <>
                Welcome, {current_user.nName}{" "}
                {current_user.admin ? <>(Admin)</> : <></>}
              </>
            ) : (
              <></>
            )}
          </div>
        ) : (
          <></>
        )}
        {state !== "info" &&
        state !== "loggedin" &&
        state != "policies" &&
        state != "manage" ? (
          <div className="login-btn-top">
            <button
              onClick={returnPage}
              style={{
                backgroundColor: "rgb(211, 211, 211)",
                fontWeight: state === "login" ? "bold" : "bold",
                marginRight: "1em",
              }}
            >
              {" "}
              Return{" "}
            </button>
          </div>
        ) : (
          <></>
        )}

        {state == "info" ? (
          <Info choice={handleState} user={current_user} />
        ) : (
          <></>
        )}
        {state == "login" ? <Login onLogin={handleLogin} /> : <></>}
        {state == "signup" ? <SignUp onSignup={handleLogin} /> : <></>}
        {state == "loggedin" && userType == "general" ? (
          <Home user={current_user} />
        ) : (
          <></>
        )}
        {state == "loggedin" && userType == "admin" ? (
          <AdminHome user={current_user} />
        ) : (
          <></>
        )}
        {state == "user" ? <Home user={current_user} /> : <></>}
        {state == "user" ? <Home user={current_user} /> : <></>}
        <div id="policies">
          <button className="footer-btn" onClick={getSecurity}>
            Security & Privacy Policy
          </button>
          <button className="footer-btn" onClick={getUse}>
            Acceptable Use Policy{" "}
          </button>
          <button className="footer-btn" onClick={getDCMA}>
            DCMA notice & takedown Policy{" "}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
