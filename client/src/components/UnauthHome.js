import React from "react";
import { useState, useEffect } from "react";
import HeroSearch from "./HeroSearch";
import PublicLists from "./PublicLists";

const UnauthHome = (props) => {
  const [localstate, setstate] = useState("home");
  const current_user = props.user ? props.user : 0;

  return (
    <div className="unauth-home">
      <button
        id="options"
        value="hero-search"
        onClick={(e) => setstate(e.target.value)}
      >
        Search Heroes
      </button>
      <button
        id="options"
        value="public-lists"
        onClick={(e) => setstate(e.target.value)}
      >
        View Public Lists
      </button>
      {localstate == "hero-search" ? <HeroSearch /> : <></>}
      {localstate == "public-lists" ? (
        <PublicLists user={current_user} />
      ) : (
        <></>
      )}
    </div>
  );
};

export default UnauthHome;
