const express = require("express");
const { sanitize } = require("../utils/sanitizer");
const router = express.Router();
const { authenticateAdminToken } = require("../middleware/auth");
const Log = require("../models/Log"); // Assuming you have a Log model

router.post("/newLog", authenticateAdminToken, async (req, res) => {
  const newLog = req.body;
  let year = sanitize(newLog.year);
  let month = sanitize(newLog.month);
  let day = sanitize(newLog.day);

  // Ensure month and day are two digits
  if (month.split("").length == 1) {
    month = "0" + month;
  }

  if (day.split("").length == 1) {
    day = "0" + day;
  }

  const dateRec = `${year}-${month}-${day}`;

  try {
    // Create a new log entry in MongoDB
    const log = new Log({
      dateRec: dateRec,
      revDetails: sanitize(newLog.revDetails),
      notes: sanitize(newLog.notes),
      status: "active", // default status
      type: sanitize(newLog.type),
    });

    // Save the log entry to the database
    await log.save();

    // Respond with success message
    res.status(200).json({ message: "Successfully logged" });
  } catch (error) {
    // Catch any errors and send a 500 error response
    res.status(500).json({ error: "A server-side error occurred" });
    console.error("Error while saving log:", error);
  }
});

module.exports = router;
