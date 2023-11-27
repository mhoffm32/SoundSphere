import React from "react";
import { useState, useEffect } from "react";
import UnauthHome from "./UnauthHome";

const Home = (props) => {
  const user = props.user;
  console.log(user);

  return (
    <div>
      <h2>Welcome</h2>
      {user ? (
        <div>
          <p>User ID: {user.id} </p>
          <p>User Name: {user.nName}</p>
          <p>User Email: {user.email}</p>
        </div>
      ) : (
        <p>User is undefined</p>
      )}
      <UnauthHome user={user} />
    </div>
  );
};

export default Home;
