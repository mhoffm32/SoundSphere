const express = require("express");
const { sanitize } = require("../utils/sanitizer");
const router = express.Router();
const { authenticateAdminToken } = require("../middleware/auth");

router.post("/newLog", authenticateAdminToken, (req, res) => {
  const newLog = req.body;
  let year = sanitize(newLog.year);
  let month = sanitize(newLog.month);
  let day = sanitize(newLog.day);

  if (month.split("").length == 1) {
    month = "0" + month;
  } else if (day.split("").length == 1) {
    day = "0" + day;
  }

  dateRec = `${year}-${month}-${day}`;

  const sql =
    "INSERT INTO dcmaLog(dateRec, revDetails, notes, status, type) VALUES (?,?,?,?,?)";
  const values = [
    dateRec,
    sanitize(newLog.revDetails),
    sanitize(newLog.notes),
    "active",
    sanitize(newLog.type),
  ];

  try {
    connection.query(sql, values, (error, results) => {
      if (error) {
        res.status(501).json({ message: error.message });
      } else {
        res.status(200).json({ message: "successfully logged" });
      }
    });
  } catch (error) {
    res.status(500).json({ error: "An server side error occurred " });
  }
});

module.exports = router;
