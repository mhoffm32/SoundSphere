const express = require("express");
const router = express.Router();
const { sanitize } = require("../utils/sanitizer");
const { getCurrentDateTime } = require("../utils/dateTime");
const {
  authenticateAdminToken,
  authenticateToken,
} = require("../middleware/auth");

router.get("/saved-lists/:id", authenticateToken, (req, res) => {
  const sql = "SELECT * FROM Hero_Lists WHERE UserID = ?";
  let userID = req.params.id;
  userID = sanitize(userID);
  let lists = [];

  try {
    connection.query(sql, [userID], (error, results) => {
      if (error) {
        res.status(501).json({ error: "An SQL error occurred" });
      } else {
        for (let list of results) {
          let heroes_info = [];
          let ids = JSON.parse(list.HeroIDs);

          let lratings = [];

          if (list.ratings == null) {
            lratings = [];
          } else {
            lratings = JSON.parse(list.Ratings);
          }
          let listRating = 0;

          if (list.ratings) {
            for (let rating of lratings) {
              listRating = listRating + rating["rating"];
            }
            listRating = (listRating / lratings.length).toFixed(2);
          } else {
            listRating = "N/A";
          }

          for (let curr_id of ids) {
            curr_id = Number(curr_id);
            let hero_obj = hero_info.find((e) => e.id === curr_id);
            heroes_info.push(hero_obj);
          }

          if (list.Nickname != null) {
            lists.push({
              id: list.UserID,
              heroes: heroes_info,
              ListName: list.ListName,
              creator: list.Nickname,
              lastEdit: list.LastEdit,
              rating: listRating,
              reviews: lratings,
              description: list.Description,
              public: list.Public,
            });
          }
        }

        lists = lists.sort(
          (a, b) => b.lastEdit.getTime() - a.lastEdit.getTime()
        );
        lists = lists.slice(0, 10);
        res.status(200).json(lists);
      }
    });
  } catch (error) {
    res.status(500).json({ error: "An server side error occurred " });
  }
});

router.post("/new-list", authenticateToken, (req, res) => {
  const newList = req.body;
  console.log("initial value:", req.body);
  const sql =
    "INSERT INTO Hero_Lists(UserID, ListName, HeroIDs, Nickname, LastEdit, Description, Ratings, Public) VALUES (?,?,?,?,?,?,?,?)";
  const values = [
    sanitize(newList.userID),
    sanitize(newList.listName),
    sanitize(JSON.stringify(newList.heroIDs)),
    sanitize(newList.nickname),
    sanitize(getCurrentDateTime()),
    sanitize(newList.description),
    sanitize(JSON.stringify(newList.ratings)),
    Number(sanitize(newList.public)),
  ];

  console.log("value when adding:", sanitize(JSON.stringify(newList.heroIDs)));

  try {
    connection.query(sql, values, (error, results) => {
      if (error) {
        res.status(501).json({ message: error });
      } else {
        res.status(200).json({ message: results });
      }
    });
  } catch (error) {
    res.status(500).json({ error: "An server side error occurred " });
  }
});

router.get("/delete-list/:id/:listName", (req, res) => {
  const id = Number(sanitize(req.params.id));
  const lName = sanitize(req.params.listName);
  const sql = "DELETE FROM Hero_Lists WHERE UserID = ? AND ListName = ?";
  const values = [id, lName];

  try {
    connection.query(sql, values, (error, results) => {
      if (error) {
        res.status(501).json({ message: error });
      } else {
        res.status(200).json({ message: "successfully deleted" });
      }
    });
  } catch (error) {
    res.status(500).json({ error: "An server side error occurred " });
  }
});

router.post("/edit-list", authenticateToken, (req, res) => {
  const id = Number(sanitize(req.body.id));
  const lName = sanitize(req.body.name);
  let field = sanitize(req.body.field);
  let value = req.body.value;

  if (field === "public") {
    value = Number(value);
  } else if (field === "heroes") {
    field = "HeroIDs";
    value = JSON.stringify(value);
  }

  console.log("value from api/edit-list:", value);

  const sql = `UPDATE Hero_Lists SET ${field} = ? WHERE UserID = ? AND ListName = ?`;
  const values = [value, id, lName];

  try {
    connection.query(sql, values, (error, results) => {
      if (error) {
        res.status(501).json({ message: error });
      } else {
        try {
          const sql2 =
            "UPDATE Hero_Lists SET LastEdit = ? WHERE UserID = ? AND ListName = ?";
          const value = [getCurrentDateTime(), id, lName];
          connection.query(sql2, value, (error, results) => {
            if (error) {
              res.status(501).json({ message: error });
            } else {
              res.status(200).json({ message: "successfully updated" });
            }
          });
        } catch (error) {
          res.status(500).json({ error: "An server side error occurred " });
        }
      }
    });
  } catch (error) {
    res.status(500).json({ error: "An server side error occurred " });
  }
});

router.post("/add-review", authenticateToken, (req, res) => {
  const newReview = req.body;
  const sql =
    "SELECT Ratings From Hero_Lists WHERE UserID = ? AND listName = ?";
  const values = [newReview.listID, newReview.listName];

  try {
    connection.query(sql, values, (error, results) => {
      if (error) {
        res.status(501).json({ error: "An SQL error occurred" });
      } else {
        let ratings = JSON.parse(results[0].Ratings);
        if (ratings == null) {
          ratings = [];
        }
        let comment = newReview.comment;

        if (comment.trim() === "") {
          comment = "n/a";
        }

        ratings.push({
          user: newReview.user,
          rating: newReview.rating,
          comment: comment,
          editDate: getCurrentDateTime(),
          hidden: 0,
        });

        const sql2 =
          "Update Hero_Lists SET Ratings = ? WHERE UserID = ? AND listName = ?";
        const values2 = [
          JSON.stringify(ratings),
          newReview.listID,
          newReview.listName,
        ];

        try {
          connection.query(sql2, values2, (error, results) => {
            if (error) {
              res.status(501).json({ error: "An SQL error occurred" });
            } else {
              res.status(200).json("all good");
            }
          });
        } catch (error) {
          res.status(500).json({ error: "An server side error occurred " });
        }
      }
    });
  } catch (error) {
    res.status(500).json({ error: "An server side error occurred " });
  }
});

router.post("/manage-review", authenticateAdminToken, (req, res) => {
  const listDetails = req.body.list;
  const revDetails = req.body.review;

  const sql =
    "SELECT Ratings From Hero_Lists WHERE UserID = ? AND listName = ?";
  const values = [listDetails.id, listDetails.ListName];

  try {
    connection.query(sql, values, (error, results) => {
      if (error) {
        res.status(501).json({ error: "An SQL error occurred" });
      } else {
        let ratings = JSON.parse(results[0].Ratings);
        if (ratings == null) {
          ratings = [];
        }

        for (r of ratings) {
          if (
            r.user == revDetails.user &&
            r.rating == revDetails.rating &&
            r.comment == revDetails.comment
          ) {
            r.hidden = !revDetails.hidden;
          }
        }
        const sql2 =
          "Update Hero_Lists SET Ratings = ? WHERE UserID = ? AND listName = ?";
        const values2 = [
          JSON.stringify(ratings),
          listDetails.id,
          listDetails.ListName,
        ];

        try {
          connection.query(sql2, values2, (error, results) => {
            if (error) {
              res.status(501).json({ error: "An SQL error occurred" });
            } else {
              res.status(200).json("all good");
            }
          });
        } catch (error) {
          res.status(500).json({ error: "An server side error occurred " });
        }
      }
    });
  } catch (error) {
    res.status(500).json({ error: "An server side error occurred " });
  }
});

router.get("/public-lists", (req, res) => {
  const sql = "SELECT * FROM Hero_Lists WHERE Public = ?";
  let lists = [];

  try {
    connection.query(sql, [1], (error, results) => {
      if (error) {
        res.status(501).json({ error: "An SQL error occurred" });
      } else {
        for (let list of results) {
          let heroes_info = [];
          let ids = JSON.parse(list.HeroIDs);
          let ratings = JSON.parse(list.Ratings);
          let listRating = 0;

          if (ratings) {
            for (let rating of ratings) {
              listRating = listRating + Number(rating["rating"]);
            }
            listRating = (listRating / ratings.length).toFixed(2);
          } else {
            listRating = "N/A";
          }

          for (let curr_id of ids) {
            curr_id = Number(curr_id);
            let hero_obj = hero_info.find((e) => e.id === curr_id);
            heroes_info.push(hero_obj);
          }
          lists.push({
            id: list.UserID,
            heroes: heroes_info,
            ListName: list.ListName,
            creator: list.Nickname,
            lastEdit: list.LastEdit,
            rating: Number(listRating),
            reviews: JSON.parse(list.Ratings),
            description: list.Description,
          });
        }

        lists = lists.sort(
          (a, b) => b.lastEdit.getTime() - a.lastEdit.getTime()
        );
        lists = lists.slice(0, 10);
        res.status(200).json(lists);
      }
    });
  } catch (error) {
    res.status(500).json({ error: "An server side error occurred " });
  }
});

module.exports = router;
