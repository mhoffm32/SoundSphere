import React from "react";
import { useState, useEffect } from "react";
import HeroSearch from "./HeroSearch";
import SavedLists from "./SavedLists";
import PublicLists from "./PublicLists";

const UnauthHome = (props) => {
  const [localstate, setstate] = useState("home");
  const current_user = props.user ? props.user : false;

  return (
    <div className="unauth-home">
      <div className="button-box">
        <button
          id="options"
          className="default-btn"
          value="hero-search"
          style={{
            backgroundColor:
              localstate === "hero-search" ? "rgb(20,204,204)" : "",
            fontWeight: localstate === "hero-search" ? "bold" : "normal",
          }}
          onClick={(e) => setstate(e.target.value)}
        >
          Search Heroes
        </button>
        <button
          id="options"
          className="default-btn"
          value="public-lists"
          style={{
            backgroundColor:
              localstate === "public-lists" ? "rgb(20,204,204)" : "",
            fontWeight: localstate === "public-lists" ? "bold" : "normal",
          }}
          onClick={(e) => setstate(e.target.value)}
        >
          View Public Lists
        </button>
      </div>

      {current_user ? (
        <div className="button-box">
          <button
            id="options"
            value="saved-lists"
            className="default-btn"
            style={{
              backgroundColor:
                localstate === "saved-lists" ? "rgb(20,204,204)" : "",
              fontWeight: localstate === "saved-lists" ? "bold" : "normal",
            }}
            onClick={(e) => setstate(e.target.value)}
          >
            My Lists
          </button>
        </div>
      ) : (
        <></>
      )}

      {localstate == "hero-search" ? <HeroSearch /> : <></>}
      {localstate == "public-lists" ? (
        <PublicLists user={current_user} />
      ) : (
        <></>
      )}
      {localstate == "saved-lists" ? <SavedLists user={current_user} /> : <></>}
    </div>
  );
};

export default UnauthHome;
