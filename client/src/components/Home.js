import React from "react";
import { useState, useEffect } from "react";
import UnauthHome from "./UnauthHome";

const Home = (props) => {
  const user = props.user;
  console.log(user);

  return (
    <div>
      {user ? (
        <div>
          <h2>{user.nName}'s Hero Search</h2>
          <p>User ID: {user.id} </p>
          <p>User Name: {user.nName}</p>
          <p>User Email: {user.email}</p>
          <UnauthHome user={user} />
        </div>
      ) : (
        <p>User is undefined</p>
      )}
    </div>
  );
};

export default Home;
