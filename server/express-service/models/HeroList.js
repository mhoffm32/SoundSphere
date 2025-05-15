const mongoose = require("mongoose");

const heroListSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Assuming you have a User model for user authentication
    required: true,
  },
  listName: {
    type: String,
    required: true,
  },
  heroIDs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hero",
    },
  ],
  nickname: {
    type: String,
  },
  lastEdit: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String,
  },
  ratings: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the user who gave the rating
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        default: "n/a",
      },
      editDate: {
        type: Date,
        default: Date.now,
      },
      hidden: {
        type: Boolean,
        default: false,
      },
    },
  ],
  public: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("HeroList", heroListSchema);
