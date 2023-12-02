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

  const [pState, setPState] = useState("");
  const { token, setToken } = useAuth();
  const { priv } = useAuth();
  const { dcma } = useAuth();
  const { use } = useAuth();

  console.log(priv);
  let loginText = "Log In";

  if (state == "loggedin") {
    loginText = "Log Out";
  }

  const handleState = (state1) => {
    setState(state1);
  };

  const getUse = () => {
    setState("policies");
    setPState("use");
  };

  const getDCMA = () => {
    setState("policies");
    setPState("dcma");
  };
  const getSecurity = () => {
    setState("policies");
    setPState("security");
  };

  function onLoginClick() {
    if (state == "loggedin") {
      setState("info");
      loginText = "Log In";
      setCurrentUser(null);
      setToken(null);
    } else {
      setState("login");
      loginText = "Log Out";
    }
  }

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
    <div>
      <div id="content">
        {state == "policies" ? (
          <>
            <button onClick={() => setState("info")}>Return</button>
            {pState == "use" ? (
              <>
                <h1>Acceptable Use Policy</h1>
                <p>{use}</p>
              </>
            ) : (
              <></>
            )}
            {pState == "dcma" ? (
              <>
                <h1>DMCA notice & takedown policy</h1>
                <p>{dcma}</p>
              </>
            ) : (
              <></>
            )}
            {pState == "security" ? (
              <>
                <h1>Security & Privacy policy</h1>
                <p>{priv}</p>
              </>
            ) : (
              <></>
            )}
          </>
        ) : (
          <></>
        )}

        {state != "login" && state != "policies" ? (
          <div>
            <button
              onClick={onLoginClick}
              style={{
                backgroundColor:
                  state === "loggedin"
                    ? "rgb(242, 126, 132)"
                    : "rgb(129, 199, 146)",
                fontWeight: state === "login" ? "bold" : "bold",
              }}
            >
              {loginText}
            </button>
            {current_user !== null && current_user.id !== 0 ? (
              <>Welcome, {current_user.nName}</>
            ) : (
              <></>
            )}
          </div>
        ) : (
          <></>
        )}
        {state !== "info" && state !== "loggedin" && state != "policies" ? (
          <button onClick={returnPage}> Return </button>
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
          <button onClick={getSecurity}>Security & Privacy Policy</button>
          <button onClick={getUse}>Acceptable Use Policy </button>
          <button onClick={getDCMA}>DCMA notice & takedown Policy </button>
        </div>
      </div>
    </div>
  );
}

export default App;
