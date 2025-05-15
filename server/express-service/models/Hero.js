const mongoose = require("mongoose");

const heroSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  // Add any other hero-specific fields you need
});

module.exports = mongoose.model("Hero", heroSchema);
