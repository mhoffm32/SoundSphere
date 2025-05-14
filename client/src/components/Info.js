import React from "react";
import { useState, useEffect } from "react";
import UnauthHome from "./UnauthHome";

const Info = (props) => {
  const { current_user } = props.user ? props.user : 0;
  const choice = props.choice;

  return (
    <div className="info">
      <h1 id="info-title">HeroWorld</h1>
      <p id="blurb">I AM BLIRB</p>
      <button
        className="default-btn"
        value="signup"
        onClick={(e) => choice(e.target.value)}
      >
        {" "}
        Create Account
      </button>
      <br />
      <br />
      <UnauthHome user={current_user} />
    </div>
  );
};

export default Info;
