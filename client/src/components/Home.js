import React from 'react';
import {useState,useEffect} from 'react';

const Home = (props) => {
    
    const { user } = props;

    console.log('User in ChildComponent:', user);

  return (
    <div>
      <h2>Welcome</h2>
      {user ? (
        <div>
          <p>User ID: {user.id}</p>
          <p>User Name: {user.nName}</p>
          <p>User Email: {user.email}</p>
        </div>
      ) : (
        <p>User prop is undefined</p>
      )}
    </div>
  );
}


export default Home;