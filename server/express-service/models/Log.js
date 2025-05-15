const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  dateRec: String,
  revDetails: String,
  notes: String,
  status: { type: String, default: "active" },
  type: String,
});

const Log = mongoose.model("Log", logSchema);

module.exports = Log;
