const express = require("express");
const router = express.Router();
const { authenticateAdminToken } = require("../middleware/auth");
const { connection } = require("../config/db");

router.post("/update-policy", authenticateAdminToken, (req, res) => {
  const newPolicy = req.body;
  let policy = newPolicy.policy;
  let text = newPolicy.text;

  const sql = `UPDATE Policies SET ${policy} = ?`;

  try {
    connection.query(sql, [text], (error, results) => {
      if (error) {
        res.status(501).json({ message: error.message });
      } else {
        res.status(200).json({ message: "successfully updated" });
      }
    });
  } catch (error) {
    res.status(500).json({ error: "An server side error occurred " });
  }
});

router.get("/get-policies", (req, res) => {
  const sql = `SELECT * FROM Policies`;
  try {
    connection.query(sql, (error, results) => {
      if (error) {
        res.status(501).json({ message: error.message });
      } else {
        res.status(200).json({
          privacy: results[0].privacy,
          use: results[0].accUse,
          dcma: results[0].dcma,
        });
      }
    });
  } catch (error) {
    res.status(500).json({ error: "A server side error occurred " });
  }
});

module.exports = router;
