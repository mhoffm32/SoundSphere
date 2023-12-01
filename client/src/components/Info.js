import React from "react";
import { useState, useEffect } from "react";
import UnauthHome from "./UnauthHome";

const Info = (props) => {
  const { current_user } = props.user ? props.user : 0;
  const choice = props.choice;

  return (
    <div className="info">
      <h1 id="info-title">Hero World</h1>
      <p id="blurb">
        Welcome to the superhero information website. Here you can search
        through our database of super heroes and view detailed descriptions
        including name, gener, eye color, race, hair color, height, publisher,
        skin color, alignment, and weight. As an authenticated user with a
        logged in account, you will be given the ability to create your own
        custom lists filled with your own choices of favorite super heroes!
        These custom lists can be made public to display for other super hero
        fans or can be made private for your own personal viewing. Signup for
        free today!{" "}
      </p>
      <button value="signup" onClick={(e) => choice(e.target.value)}>
        {" "}
        Sign Up
      </button>
      <br />
      <br />
      <UnauthHome user={current_user} />
    </div>
  );
};

export default Info;
