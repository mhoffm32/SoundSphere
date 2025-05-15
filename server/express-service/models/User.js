const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  nName: { type: String, required: true },
  verificationToken: { type: String },
  disabled: { type: Boolean, default: false },
  admin: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", userSchema);
