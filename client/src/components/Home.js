import React from "react";
import { useState, useEffect } from "react";
import UnauthHome from "./UnauthHome";
import { useAuth } from "../AuthContext";

const Home = (props) => {
  const user = props.user;
  const [state, setState] = useState("home");

  return (
    <div>
      {user ? (
        <div>
          {state == "home" ? (
            <>
              <h2>{user.nName}'s HeroWorld</h2>
              <UnauthHome user={user} />
            </>
          ) : (
            <></>
          )}
        </div>
      ) : (
        <p>User is undefined</p>
      )}
    </div>
  );
};

export default Home;
