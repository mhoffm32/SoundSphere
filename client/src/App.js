import Header from "./components/Header";
import { useState, useEffect } from "react";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Info from "./components/Info";
import Home from "./components/Home";
import AdminHome from "./components/AdminHome";
import User from "./User";
import "./App.css";

//Page header will change to login/logout and site info
function App() {
  const [state, setState] = useState("info");
  const [current_user, setCurrentUser] = useState(null);
  const [userType, setUserType] = useState("");

  let loginText = "Log In";

  if (state == "loggedin") {
    loginText = "Log Out";
  }

  const handleState = (state1) => {
    setState(state1);
  };

  function onLoginClick() {
    if (state == "loggedin") {
      setState("info");
      loginText = "Log In";
      setCurrentUser(null);
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
        {state != "login" ? (
          <div>
            <button onClick={onLoginClick}>{loginText}</button>
            {current_user !== null && current_user.id !== 0 ? (
              <>
                Current User: {current_user.nName} User ID: {current_user.id}{" "}
              </>
            ) : (
              <></>
            )}
          </div>
        ) : (
          <></>
        )}
        {state !== "info" && state !== "loggedin" ? (
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
      </div>
    </div>
  );
}

export default App;
