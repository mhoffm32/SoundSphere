const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const adminKey = process.env.JWT_ADMIN_SECRET;

const {
  authenticateToken,
  authenticateAdminToken,
} = require("../middleware/auth");
const { connection } = require("../config/db");
const { sanitize } = require("../utils/sanitizer");
const { unverifiedUsers } = require("./unverifiedUsers");

// GET change password
router.get(
  "/change-pass/:id/:old/:new",
  authenticateToken,
  async (req, res) => {
    let userID = sanitize(req.params.id);
    let oldPass = sanitize(req.params.old);
    let newPass = sanitize(req.params.new);

    const sql = "SELECT * FROM Users WHERE UserID = ?";

    try {
      connection.query(sql, [userID], async (error, results) => {
        if (error) {
          res.status(501).json({ error: "An SQL error occurred" });
        } else {
          let hp = results[0].password;

          const match = await bcrypt.compare(oldPass, hp);

          if (match) {
            try {
              bcrypt.hash(newPass, 10, (hashError, hashedPassword) => {
                if (hashError) {
                  res.status(500).json({ error: "Error hashing the password" });
                  return;
                }
                const sql2 = "UPDATE Users SET password = ? WHERE UserID = ?";
                connection.query(
                  sql2,
                  [hashedPassword, userID],
                  (error, results) => {
                    if (error) {
                      res.status(501).json({ error: "An SQL error occurred" });
                    } else {
                      res.status(200).json({
                        messsage: "Password Successfully changed.",
                        status: 200,
                      });
                    }
                  }
                );
              });
            } catch (error) {
              res.status(500).json({ error: "An server side error occurred " });
            }
          } else {
            res
              .status(200)
              .json({ message: "Incorrect Current Password", status: 404 });
          }
        }
      });
    } catch (error) {
      res.status(500).json({ error: "An server side error occurred " });
    }
  }
);

// GET user by email and password
router.get("/get_user/:email/:password", (req, res) => {
  const userEmail = sanitize(req.params.email.trim());
  const userPass = sanitize(req.params.password.trim());

  const sql = "SELECT * FROM Users WHERE email = ?";
  const values = [userEmail];

  try {
    connection.query(sql, values, async (error, results) => {
      if (error) {
        res.status(501).json({ error: "An sql error occurred" });
      } else {
        if (results.length > 0) {
          const hashedPassword = results[0].password;

          const match = await bcrypt.compare(userPass, hashedPassword);

          if (match) {
            let token = jwt.sign(
              { userId: results[0].userID },
              process.env.JWT_USER_SECRET,
              {
                expiresIn: "1h",
              }
            );

            if (results[0].admin) {
              token = jwt.sign({ userId: results[0].userID }, adminKey, {
                expiresIn: "1h",
              });
            }

            res
              .status(200)
              .json({ user: results[0], token: token, status: 200 });
          } else {
            res.status(404).json({ message: "Incorrect Password.", status: 0 });
          }
        } else {
          res.status(404).json({
            message: `User with email ${userEmail} not found.`,
            status: 404,
          });
        }
      }
    });
  } catch (error) {
    res.status(500).json({ error: "A server-side error occurred" });
  }
});

router.post("/add-user", (req, res) => {
  const newUser = req.body;

  const verificationToken = crypto
    .createHash("sha256")
    .update(newUser.email + newUser.nName + newUser.password)
    .digest("hex");

  const randomCode = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;

  bcrypt.hash(newUser.password, 10, (hashError, hashedPassword) => {
    if (hashError) {
      res.status(500).json({ error: "Error hashing the password" });
      return;
    }
    unverifiedUsers.push({
      user: { ...newUser, password: hashedPassword },
      token: verificationToken,
      verified: false,
      code: randomCode,
    });

    const verificationLink = `http://${process.env.HOST}:${process.env.PORT}/api/email/verify-email/${verificationToken}/${randomCode}`;

    const sql = "SELECT * FROM Users WHERE email = ?";
    const values = [newUser.email];

    try {
      connection.query(sql, values, (error, results) => {
        if (error) {
          if (error.errno === 1062) {
            res.status(500).json({ error: error.message });
          }
        } else {
          if (results.length) {
            res.status(409).json({ error: "User already exists" });
          } else {
            res.status(200).json({
              message: `Awaiting Verification`,
              link: verificationLink,
              status: 200,
            });
          }
        }
      });
    } catch (error) {
      res
        .status(500)
        .json({ error: "An error occurred while appending data to the file" });
    }
  });
});

router.get("/users_list", authenticateAdminToken, (req, res) => {
  const sql = "SELECT * FROM Users";

  try {
    connection.query(sql, (error, results) => {
      if (error) {
        res.status(501).json({ error: "An SQL error occurred" });
      } else {
        if (results.length > 0) {
          res.status(200).json({ users: results });
        } else {
          res.status(404).json({ message: "No users found" });
        }
      }
    });
  } catch (error) {
    res.status(500).json({ error: "An server side error occurred " });
  }
});

router.get("/disable-user/:id/:status", authenticateAdminToken, (req, res) => {
  let disabled = sanitize(req.params.status.trim());
  let userid = sanitize(req.params.id.trim());

  const sql = "UPDATE Users SET disabled = ? WHERE userID = ?";
  const values = [disabled, userid];

  try {
    connection.query(sql, values, (error, results) => {
      if (error) {
        res.status(501).json({ error: "An sql error occurred" });
      } else {
        if (results.affectedRows > 0) {
          res.status(200).json({ results: results });
        } else {
          res.status(404).json({ message: "Unable to update" });
        }
      }
    });
  } catch (error) {
    res.status(500).json({ error: "An server side error occurred " });
  }
});

router.get("/admin-user/:id/:status", authenticateAdminToken, (req, res) => {
  let userid = sanitize(req.params.id.trim());
  let admin = sanitize(req.params.status.trim());

  const sql = "UPDATE Users SET admin = ? WHERE userID = ?";
  const values = [admin, userid];

  connection.query(sql, values, (error, results) => {
    if (error) {
      console.error("SQL error:", error.message);
      res.status(500).json({ error: "A server-side error occurred" });
    } else {
      if (results.affectedRows > 0) {
        res.status(200).json({ message: "Update successful" });
      } else {
        res.status(404).json({ message: "No user found for the provided ID" });
      }
    }
  });
});

module.exports = router;
