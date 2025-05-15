const express = require("express");
const router = express.Router();
const { sanitize } = require("../utils/sanitizer");
const { unverifiedUsers } = require("./unverifiedUsers");
const { getDb } = require("../config/mongo");

let currUserVerified = null;
let db;

// Called from index.js once DB is connected
function setClient() {
  db = getDb();
}

function getDatabase() {
  if (!db) {
    throw new Error("MongoDB not connected");
  }
  return db;
}

router.get("/verify-email/:token/:code", async (req, res) => {
  let token = decodeURIComponent(req.params.token).split("/").pop();
  const code = Number(req.params.code);

  const userToVerify = unverifiedUsers.find(
    (u) => u.token === token && u.code === code
  );

  if (userToVerify) {
    currUserVerified = userToVerify.user;

    try {
      const collection = getDatabase().collection("Users");
      const result = await collection.insertOne({
        nName: userToVerify.user.nName,
        email: userToVerify.user.email,
        password: userToVerify.user.password,
      });

      currUserVerified.userID = result.insertedId;

      res
        .status(200)
        .json(
          `User with email ${currUserVerified.email} verified successfully!`
        );
    } catch (error) {
      res.status(409).json({ error: error.message });
    }
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

module.exports = { router, setClient };
