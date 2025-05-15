const express = require("express");
require("dotenv").config();
const router = express.Router();
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const adminKey = process.env.JWT_ADMIN_SECRET;
const {
  authenticateToken,
  authenticateAdminToken,
} = require("../middleware/auth");
const { sanitize } = require("../utils/sanitizer");
const { unverifiedUsers } = require("./unverifiedUsers");
const User = require("../models/User"); // Assuming you have a User model in models/User.js
const HOST = "localhost";
const PORT = 5001;

// GET change password
router.get(
  "/change-pass/:id/:old/:new",
  authenticateToken,
  async (req, res) => {
    let userID = sanitize(req.params.id);
    let oldPass = sanitize(req.params.old);
    let newPass = sanitize(req.params.new);

    try {
      const user = await User.findById(userID);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const match = await bcrypt.compare(oldPass, user.password);

      if (match) {
        bcrypt.hash(newPass, 10, async (hashError, hashedPassword) => {
          if (hashError) {
            return res
              .status(500)
              .json({ error: "Error hashing the password" });
          }

          user.password = hashedPassword;
          await user.save();

          res.status(200).json({
            message: "Password Successfully changed.",
            status: 200,
          });
        });
      } else {
        res
          .status(200)
          .json({ message: "Incorrect Current Password", status: 404 });
      }
    } catch (error) {
      res.status(500).json({ error: "A server-side error occurred" });
    }
  }
);

// GET user by email and password
router.get("/get_user/:email/:password", async (req, res) => {
  const userEmail = sanitize(req.params.email.trim());
  const userPass = sanitize(req.params.password.trim());

  try {
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({
        message: `User with email ${userEmail} not found.`,
        status: 404,
      });
    }

    const match = await bcrypt.compare(userPass, user.password);

    if (match) {
      let token = jwt.sign(
        { userId: user.userID },
        process.env.JWT_USER_SECRET,
        { expiresIn: "1h" }
      );

      if (user.admin) {
        token = jwt.sign({ userId: user.userID }, adminKey, {
          expiresIn: "1h",
        });
      }

      res.status(200).json({ user, token, status: 200 });
    } else {
      res.status(404).json({ message: "Incorrect Password.", status: 0 });
    }
  } catch (error) {
    res.status(500).json({ error: "A server-side error occurred" });
  }
});

router.post("/add-user", async (req, res) => {
  const newUser = req.body;

  console.log(newUser);

  const verificationToken = crypto
    .createHash("sha256")
    .update(newUser.email + newUser.nName + newUser.password)
    .digest("hex");

  const randomCode = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;

  try {
    const hashedPassword = await bcrypt.hash(newUser.password, 10);

    const user = new User({
      ...newUser,
      password: hashedPassword,
      verificationToken: verificationToken,
    });

    unverifiedUsers.push({
      user: { ...newUser, password: hashedPassword },
      token: verificationToken,
      verified: false,
      code: randomCode,
    });

    console.log("PRIJT", HOST, PORT);
    console.log(verificationToken);
    console.log(randomCode);

    const verificationLink = `http://${HOST}:${PORT}/email/verify-email/${verificationToken}/${randomCode}`;

    console.log(verificationLink);

    res.status(200).json({
      message: `Awaiting Verification`,
      link: verificationLink,
      status: 200,
    });
  } catch (error) {
    console.error("Error in /add-user:", error);
    res.status(500).json({
      error: "An error occurred while creating the user",
    });
  }
});

router.get("/users_list", authenticateAdminToken, async (req, res) => {
  try {
    const users = await User.find();

    if (users.length > 0) {
      res.status(200).json({ users });
    } else {
      res.status(404).json({ message: "No users found" });
    }
  } catch (error) {
    res.status(500).json({ error: "A server-side error occurred" });
  }
});

router.get(
  "/disable-user/:id/:status",
  authenticateAdminToken,
  async (req, res) => {
    const disabled = sanitize(req.params.status.trim());
    const userID = sanitize(req.params.id.trim());

    try {
      const user = await User.findById(userID);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.disabled = disabled;
      await user.save();

      res.status(200).json({ message: "User status updated" });
    } catch (error) {
      res.status(500).json({ error: "A server-side error occurred" });
    }
  }
);

router.get(
  "/admin-user/:id/:status",
  authenticateAdminToken,
  async (req, res) => {
    const userID = sanitize(req.params.id.trim());
    const admin = sanitize(req.params.status.trim());

    try {
      const user = await User.findById(userID);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.admin = admin === "true";
      await user.save();

      res.status(200).json({ message: "User admin status updated" });
    } catch (error) {
      res.status(500).json({ error: "A server-side error occurred" });
    }
  }
);

module.exports = router;
