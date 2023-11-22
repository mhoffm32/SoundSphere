import React from 'react';
import {useState,useEffect} from 'react';

const AdminHome = (props) => {
    
  const { user } = props;

  return (
    <div>
      <h2>Welcome Admin User</h2>
      {user ? (
        <div>
          <p>User ID: {user.id} </p>
          <p>User Name: {user.nName}</p>
          <p>User Email: {user.email}</p>
        </div>
      ) : (
        <p>User is undefined</p>
      )}
    </div>
  );
}


export default AdminHome;