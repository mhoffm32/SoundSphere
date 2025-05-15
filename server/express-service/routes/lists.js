const express = require("express");
const router = express.Router();
const { sanitize } = require("../utils/sanitizer");
const { getCurrentDateTime } = require("../utils/dateTime");
const {
  authenticateAdminToken,
  authenticateToken,
} = require("../middleware/auth");

// MongoDB models (assuming you have these defined)
const HeroList = require("../models/HeroList");
const Hero = require("../models/Hero");

router.get("/saved-lists/:id", authenticateToken, async (req, res) => {
  const userID = sanitize(req.params.id);

  try {
    const lists = await HeroList.find({ UserID: userID });

    const result = lists.map((list) => {
      let heroes_info = [];
      let ids = JSON.parse(list.HeroIDs);
      let lratings = list.Ratings ? JSON.parse(list.Ratings) : [];
      let listRating = "N/A";

      if (lratings.length > 0) {
        listRating = (
          lratings.reduce((sum, rating) => sum + rating.rating, 0) /
          lratings.length
        ).toFixed(2);
      }

      ids.forEach((curr_id) => {
        let hero_obj = Hero.findOne({ id: curr_id }); // Assuming Hero model has a field 'id'
        heroes_info.push(hero_obj);
      });

      return {
        id: list.UserID,
        heroes: heroes_info,
        ListName: list.ListName,
        creator: list.Nickname,
        lastEdit: list.LastEdit,
        rating: listRating,
        reviews: lratings,
        description: list.Description,
        public: list.Public,
      };
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while retrieving lists" });
  }
});

router.post("/new-list", authenticateToken, async (req, res) => {
  const newList = req.body;

  try {
    const heroList = new HeroList({
      UserID: sanitize(newList.userID),
      ListName: sanitize(newList.listName),
      HeroIDs: JSON.stringify(newList.heroIDs),
      Nickname: sanitize(newList.nickname),
      LastEdit: sanitize(getCurrentDateTime()),
      Description: sanitize(newList.description),
      Ratings: JSON.stringify(newList.ratings),
      Public: Number(sanitize(newList.public)),
    });

    await heroList.save();
    res.status(200).json({ message: "List successfully created" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while creating the list" });
  }
});

router.get("/delete-list/:id/:listName", async (req, res) => {
  const id = sanitize(req.params.id);
  const lName = sanitize(req.params.listName);

  try {
    await HeroList.deleteOne({ UserID: id, ListName: lName });
    res.status(200).json({ message: "Successfully deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while deleting the list" });
  }
});

router.post("/edit-list", authenticateToken, async (req, res) => {
  const id = sanitize(req.body.id);
  const lName = sanitize(req.body.name);
  const field = sanitize(req.body.field);
  let value = req.body.value;

  if (field === "public") {
    value = Number(value);
  } else if (field === "heroes") {
    value = JSON.stringify(value);
  }

  try {
    const update = { [field]: value, LastEdit: getCurrentDateTime() };
    await HeroList.updateOne({ UserID: id, ListName: lName }, update);
    res.status(200).json({ message: "List successfully updated" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while updating the list" });
  }
});

router.post("/add-review", authenticateToken, async (req, res) => {
  const newReview = req.body;

  try {
    const list = await HeroList.findOne({
      UserID: newReview.listID,
      ListName: newReview.listName,
    });

    let ratings = JSON.parse(list.Ratings) || [];
    ratings.push({
      user: newReview.user,
      rating: newReview.rating,
      comment: newReview.comment.trim() || "n/a",
      editDate: getCurrentDateTime(),
      hidden: 0,
    });

    await HeroList.updateOne(
      { UserID: newReview.listID, ListName: newReview.listName },
      { Ratings: JSON.stringify(ratings) }
    );

    res.status(200).json("Review added successfully");
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while adding the review" });
  }
});

router.post("/manage-review", authenticateAdminToken, async (req, res) => {
  const listDetails = req.body.list;
  const revDetails = req.body.review;

  try {
    const list = await HeroList.findOne({
      UserID: listDetails.id,
      ListName: listDetails.ListName,
    });

    let ratings = JSON.parse(list.Ratings) || [];
    ratings = ratings.map((rating) => {
      if (
        rating.user === revDetails.user &&
        rating.rating === revDetails.rating &&
        rating.comment === revDetails.comment
      ) {
        rating.hidden = !revDetails.hidden;
      }
      return rating;
    });

    await HeroList.updateOne(
      { UserID: listDetails.id, ListName: listDetails.ListName },
      { Ratings: JSON.stringify(ratings) }
    );

    res.status(200).json("Review managed successfully");
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while managing the review" });
  }
});

router.get("/public-lists", async (req, res) => {
  try {
    const lists = await HeroList.find({ Public: 1 });

    const result = lists.map((list) => {
      let heroes_info = [];
      let ids = JSON.parse(list.HeroIDs);
      let ratings = JSON.parse(list.Ratings);
      let listRating = "N/A";

      if (ratings) {
        listRating = (
          ratings.reduce((sum, rating) => sum + Number(rating.rating), 0) /
          ratings.length
        ).toFixed(2);
      }

      ids.forEach((curr_id) => {
        let hero_obj = Hero.findOne({ id: curr_id });
        heroes_info.push(hero_obj);
      });

      return {
        id: list.UserID,
        heroes: heroes_info,
        ListName: list.ListName,
        creator: list.Nickname,
        lastEdit: list.LastEdit,
        rating: Number(listRating),
        reviews: ratings,
        description: list.Description,
      };
    });

    res.status(200).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching public lists" });
  }
});

module.exports = router;
