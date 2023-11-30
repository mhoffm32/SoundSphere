import React from "react";
import { useState, useEffect } from "react";

//Create a security and privacy policy that is publicly accessible. {2 points} 🌈
//Create an “acceptable use policy” (AUP) that is publicly accessible. {2 points} 🌈
//Create a DMCA notice & takedown policy that is publicly accessible. {2 points} 🌈

const Policy = () => {
  const getPrivacy = () => {};
  const getUse = () => {};
  const getDCMA = () => {};

  return (
    <div id="policies">
      <p onClick={getPrivacy}>Security & Privacy Policy </p>
      <p>Acceptable Use Policy </p>
      <p>DCMA notice & takedown Policy </p>
    </div>
  );
};

export default Policy;
