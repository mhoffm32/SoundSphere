const mongoose = require("mongoose");

const policySchema = new mongoose.Schema({
  privacy: String,
  accUse: String,
  dcma: String,
});

const Policy = mongoose.model("Policy", policySchema);

module.exports = Policy;
