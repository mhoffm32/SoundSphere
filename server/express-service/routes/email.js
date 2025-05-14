const express = require("express");
const router = express.Router();
const { sanitize } = require("../utils/sanitizer");
const { unverifiedUsers } = require("./unverifiedUsers");
// Temporary in-memory storage (ideally move to DB)
let currUserVerified = null;
let connection; // will be set from server.js

router.get("/verify-email/:token/:code", (req, res) => {
  let token = decodeURIComponent(req.params.token).split("/").pop();
  const code = Number(req.params.code);

  const userToVerify = unverifiedUsers.find(
    (u) => u.token === token && u.code === code
  );
  if (userToVerify) {
    currUserVerified = userToVerify.user;

    //unverifiedUsers.splice(index, 1);

    const sql = "INSERT INTO Users(nName, email, password) VALUES (?,?,?)";
    const values = [
      userToVerify.user.nName,
      userToVerify.user.email,
      userToVerify.user.password,
    ];

    connection.query(sql, values, (error, results) => {
      if (error) {
        res.status(409).json({ error: error.message });
      } else {
        currUserVerified.userID = results.insertId;
        res
          .status(200)
          .json(
            `User with email ${currUserVerified.email} verified successfully!`
          );
      }
    });
  } else {
    res.status(404).json({
      message: `Invalid verification token or code`,
      users: unverifiedUsers,
    });
  }
});

router.get("/check-verified/:email", (req, res) => {
  const user_email = sanitize(req.params.email.trim());
  if (currUserVerified && currUserVerified.email === user_email) {
    res.status(200).json({
      user: currUserVerified,
      userID: currUserVerified.userID,
      message: "User Verified successfully",
      status: 200,
    });
  } else {
    res.status(404).json({ message: "User not yet verified", status: 404 });
  }
});

// Allow setting connection from server.js
// router.setConnection = (conn) => {
//   connection = conn;
// };

let client;
let db;

router.setClient = (mongoClient) => {
  client = mongoClient;
  db = client.db("SoundSphere"); // Or any DB name you prefer
};

router.pushUnverifiedUser = (userObj) => {
  console.log("im being called");
  unverifiedUsers.push(userObj);
};

module.exports = router;
