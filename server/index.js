const natural = require("natural");
const express = require("express");
const app = express();
const port = 5001;
const host = "localhost";
const fs = require("fs");
const path = require("path");
const router = express.Router();
const router2 = express.Router();
const router3 = express.Router();

const bodyParser = require("body-parser");
const crypto = require("crypto");
app.use(bodyParser.json());

let unverifiedUsers = [];

//SQL configs
const mysql = require("mysql");
require("dotenv").config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

connection.connect();

const xss = require("xss");

app.get("/api", (req, res) => {
  res.json({ users: ["user1", "user2", "user3"] });
});

let hero_info;
let hero_powers;
let power_list;

//installing router at api/hero
app.use("/", express.static("client"));

app.use("/api/hero", router);
app.use("/api/users", router2);
app.use("/api/lists", router3);

app.use(express.json());
router.use(express.json());
router2.use(express.json());
router3.use(express.json());

//to automatically log the client requests
app.get("/api", (req, res) => {
  res.json({ users: ["user1", "user2", "user3"] });
});

app.use((req, res, next) => {
  console.log(`${req.method} request for ${req.url}`);
  next();
});

router3.post("/add-review", (req, res) => {
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
        let comment = newReview.comment;

        if (comment.trim() === "") {
          comment = "n/a";
        }

        ratings.push({
          user: newReview.user,
          rating: newReview.rating,
          comment: comment,
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

router3.get("/public-lists", (req, res) => {
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
              listRating = listRating + rating["rating"];
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
            rating: listRating,
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

router3.get("/saved-lists/:id", (req, res) => {
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
          let ratings = JSON.parse(list.Ratings);
          let listRating = 0;

          if (list.ratings) {
            for (let rating of ratings) {
              listRating = listRating + rating["rating"];
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
            rating: listRating,
            reviews: JSON.parse(list.Ratings),
            description: list.Description,
            public: list.Public,
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

//default sends all info data
router.get("/", (req, res) => {
  if (hero_info) {
    res.json(hero_info);
  } else {
    res.status(500).send("JSON data for info is not available");
  }
});

app.get("/verify-email/:token", (req, res) => {
  let token = decodeURIComponent(req.params.token);
  token = token.split("/");
  token = token[token.length - 1];

  // Find the user with the matching verification token
  const cuser = unverifiedUsers.find((u) => u.token === token);

  if (cuser) {
    // Mark the user as verified (update your database accordingly)
    res
      .status(200)
      .json({ message: `Your verification code is ${cuser.code}` });
  } else {
    res.status(404).json({ message: `Invalid verification link: ${token}` });
  }
});

app.get(`/verify-email/:token/:code`, (req, res) => {
  let token = decodeURIComponent(req.params.token);
  token = token.split("/");
  token = token[token.length - 1];
  let code = Number(req.params.code);

  const userToVerify = unverifiedUsers.find(
    (u) => u.token === token && u.code === code
  );

  if (userToVerify) {
    //removing from the temp array
    unverifiedUsers = unverifiedUsers.filter(
      (u) => userToVerify.user.email !== u.user.email
    );

    const sql = "INSERT INTO Users(nName,email,password) VALUES (?,?,?)";
    const values = [
      userToVerify.user.nName,
      userToVerify.user.email,
      userToVerify.user.password,
    ];

    try {
      connection.query(sql, values, (error, results) => {
        if (error) {
          res.status(409).json({ error: error.message });
        } else {
          res.status(200).json({
            message: "User Verified successfully",
            userID: results.insertId,
            status: 200,
          });
        }
      });
    } catch (error) {
      res
        .status(500)
        .json({ error: "An error occurred while appending data to the file" });
    }
  } else {
    res.status(404).json({
      message: `Invalid verification token: ${token}, Code: ${code}`,
      users: users,
    });
  }
});

router2.post("/add-user", (req, res) => {
  const newUser = req.body;

  // Generate a unique verification token (mocked using user information)
  const verificationToken = crypto
    .createHash("sha256")
    .update(newUser.email + newUser.nName + newUser.password)
    .digest("hex");

  const randomCode = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;

  // Store user information in memory

  unverifiedUsers.push({
    user: newUser,
    token: verificationToken,
    verified: false,
    code: randomCode,
  });

  // Display the verification link to the user (mocked email)
  const verificationLink = `http://${host}:${port}/verify-email/${verificationToken}`;

  //checking if user exists already
  const sql = "SELECT * FROM Users WHERE email = ?";
  const values = [newUser.email];

  try {
    connection.query(sql, values, (error, results) => {
      if (error) {
        if (error.errno === 1062) {
          res.status(500).json({ error: error.message });
        }
      } else {
        if (results.length) {
          res.status(409).json({ error: "user already exists" });
        } else {
          res.status(200).json({
            message: `Account created.`,
            link: verificationLink,
            status: 200,
          });
        }
      }
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while appending data to the file" });
  }
});

router2.get("/users_list", (req, res) => {
  const sql = "SELECT * FROM Users";

  try {
    connection.query(sql, (error, results) => {
      if (error) {
        res.status(501).json({ error: "An SQL error occurred" });
      } else {
        if (results.length > 0) {
          res.status(200).json({ users: results });
        } else {
          res.status(404).json({ message: "No users found" });
        }
      }
    });
  } catch (error) {
    res.status(500).json({ error: "An server side error occurred " });
  }
});

router2.get("/get_user/:email/:password", (req, res) => {
  const userEmail = sanitize(req.params.email.trim());
  const userPass = sanitize(req.params.password.trim());

  const sql = "SELECT * FROM Users WHERE email = ? AND password = ?";
  const values = [userEmail, userPass];

  try {
    connection.query(sql, values, (error, results) => {
      if (error) {
        res.status(501).json({ error: "An sql error occurred" });
      } else {
        if (results.length > 0) {
          res.status(200).json({ user: results[0] });
        } else {
          res.status(404).json({ message: "Invalid Credentials" });
        }
        //res.status(200).json({message: 'User added successfully',userID: results.insertId, status: 200})
      }
    });
  } catch (error) {
    res.status(500).json({ error: "An server side error occurred " });
  }
});

router2.get("/disable-user/:id/:status", (req, res) => {
  let disabled = sanitize(req.params.status.trim());
  let userid = sanitize(req.params.id.trim());

  const sql = "UPDATE Users SET disabled = ? WHERE userID = ?";
  const values = [disabled, userid];

  try {
    connection.query(sql, values, (error, results) => {
      if (error) {
        res.status(501).json({ error: "An sql error occurred" });
      } else {
        if (results.affectedRows > 0) {
          res.status(200).json({ results: results });
        } else {
          res.status(404).json({ message: "Unable to update" });
        }
      }
    });
  } catch (error) {
    res.status(500).json({ error: "An server side error occurred " });
  }
});

router2.get("/admin-user/:id/:status", (req, res) => {
  let userid = sanitize(req.params.id.trim());
  let admin = sanitize(req.params.status.trim());

  const sql = "UPDATE Users SET admin = ? WHERE userID = ?";
  const values = [admin, userid];

  connection.query(sql, values, (error, results) => {
    if (error) {
      console.error("SQL error:", error.message);
      res.status(500).json({ error: "A server-side error occurred" });
    } else {
      if (results.affectedRows > 0) {
        res.status(200).json({ message: "Update successful" });
      } else {
        res.status(404).json({ message: "No user found for the provided ID" });
      }
    }
  });
});

router.post("/deleteList", (req, res) => {
  try {
    // Getting existing data
    const jsonData = fs.readFileSync("data/superhero_lists.json", "utf8");
    const jsonArray = JSON.parse(jsonData);
    let exists = false;

    let newData = req.body;

    console.log(newData);

    for (const list of jsonArray) {
      if (list.name.toLowerCase() == newData.name.toLowerCase()) {
        exists = true;
        break;
      }
    }
    if (!exists) {
      res.status(409).json({ error: "List does not exist" });
    } else {
      let newArray = jsonArray.filter((list) => list.name !== newData.name);
      const updatedData = JSON.stringify(newArray, null, 2);
      fs.writeFileSync("data/superhero_lists.json", updatedData);
      console.log("Data deleted from the JSON file.");
      res.json({ message: "Data deleted successfully" });
    }
  } catch (error) {
    console.error("Error appending data to the JSON file:", error);
    res
      .status(500)
      .json({ error: "An error occurred while appending data to the file" });
  }
});

router.post("/newList", (req, res) => {
  const newList = req.body;

  let heroIDs = JSON.stringify(newList.heroIDs);

  const sql =
    "INSERT INTO Hero_Lists(UserID, ListName, HeroIDs) VALUES (?,?,?)";

  const values = [newList.userID, newList.listName, heroIDs];

  try {
    connection.query(sql, values, (error, results) => {
      if (error) {
        if (error.errno === 1062) {
          res.status(409).json({
            error: "List named " + newList.listName + " already exists.",
          });
        }
      } else {
        res
          .status(200)
          .json({ message: "List Added successfully", status: 200 });
      }
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while appending data to the file" });
  }
});

router.post("/newList", (req, res) => {
  try {
    // Getting existing data
    const jsonData = fs.readFileSync("data/superhero_lists.json", "utf8");
    const jsonArray = JSON.parse(jsonData);
    let exists = false;

    const newData = req.body;
    console.log(newData);

    for (const list of jsonArray) {
      if (list.name === newData.name) {
        exists = true;
        break;
      }
    }

    if (exists) {
      res.status(409).json({ error: "List name already exists" });
    } else {
      jsonArray.push(newData);
      const updatedData = JSON.stringify(jsonArray, null, 2);
      fs.writeFileSync("data/superhero_lists.json", updatedData);
      console.log("Data appended to the JSON file.");
      res.json({ message: "Data appended successfully" });
    }
  } catch (error) {
    console.error("Error appending data to the JSON file:", error);
    res
      .status(500)
      .json({ error: "An error occurred while appending data to the file" });
  }
});

//detects html and javascript potentially dangerous
function sanitize(input) {
  const sanitizedInput = xss(input);
  return sanitizedInput;
}

router.get("/past_lists", (req, res) => {
  let hero_lists = [];

  fs.readFile("data/superhero_lists.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    } else {
      let lists = JSON.parse(data);
      for (let list of lists) {
        hero_lists.push(list);
      }
      res.json(hero_lists);
    }
  });
});

const areStringsSimilar = (str1, str2) => {
  const similarity = natural.JaroWinklerDistance(
    str1.toLowerCase(),
    str2.toLowerCase()
  );
  const threshold = 0.9;
  return similarity > threshold;
};

router.get(
  `/search/:hero_name/:hero_race/:hero_power/:hero_publisher`,
  (req, res) => {
    let name = decodeURIComponent(sanitize(req.params.hero_name));
    let race = decodeURIComponent(sanitize(req.params.hero_race));
    let power = decodeURIComponent(sanitize(req.params.hero_power));
    let publisher = decodeURIComponent(sanitize(req.params.hero_publisher));

    const filter = {
      name: name,
      Race: race,
      powers: power,
      Publisher: publisher,
    };

    const filteredHeroes = hero_info.filter((hero) => {
      // Check each condition
      return Object.entries(filter).every(([key, value]) => {
        if (value === "none") {
          return true;
        }
        if (key === "powers") {
          return hero[key].includes(value);
        } else {
          if (areStringsSimilar(hero[key], value)) {
            return true;
          } else {
            return hero[key].toLowerCase().startsWith(value.toLowerCase());
          }
        }
      });
    });

    res.json(filteredHeroes);
  }
);

router.get("/powers", (req, res) => {
  if (power_list) {
    let powers = [];
    for (prop in power_list) {
      if (prop !== "hero_names") {
        powers.push(prop);
      }
    }
    //let powerList = Array.from(new Set(hero_powers.map(hero => hero["Race"] )));
    res.json(Array.from(new Set(powers)));
  } else {
    res.status(500).send("JSON data for powers is not available");
  }
});

router.get("/races", (req, res) => {
  Array.from(new Set(hero_info.map((hero) => hero["Publisher"])));
  if (hero_info) {
    let raceList = Array.from(new Set(hero_info.map((hero) => hero["Race"])));
    res.json(raceList);
  } else {
    res.status(500).send("JSON data for races is not available");
  }
});

router.get(`/search/:property/:property_value/:sortBy`, (req, res) => {
  let property = req.params.property;
  let property_value = req.params.property_value;
  let sortBy = req.params.sortBy;

  //input sanitzation
  property = sanitize(property.trim());
  sortBy = sanitize(sortBy.trim());
  property_value = sanitize(property_value.trim());

  let results = hero_info;
  let truePowers = [];

  for (hero of hero_powers) {
    let pows = [];
    for (prop in hero) {
      if (hero[prop] == "True") {
        pows.push(prop);
      }
    }
    let obj = {};
    obj.name = hero["hero_names"];
    obj.powers = pows;
    truePowers.push(obj);
  }

  if (String(property).toLowerCase() === "power") {
    truePowers = truePowers.filter((hero) =>
      hero.powers
        .map((power) => power.toLowerCase())
        .includes(property_value.toLowerCase())
    );
  } else {
    results = hero_info.filter(
      (hero) =>
        String(hero[property]).toLowerCase() === property_value.toLowerCase()
    );
  }

  for (hero of results) {
    let h_powers = truePowers.find((h) => h["name"] == hero["name"]);
    if (h_powers && h_powers.powers) {
      hero.powers = h_powers.powers;
    }
  }

  if (sortBy.toLowerCase() === "power") {
    results.sort((a, b) => {
      const l_a = Array.isArray(a.powers) ? a.powers.length : 0;
      const l_b = Array.isArray(b.powers) ? b.powers.length : 0;
      return l_b - l_a; //descending
    });
  } else if (sortBy.toLowerCase() !== "none") {
    results.sort((a, b) => a[sortBy].localeCompare(b[sortBy]));
  }
  if (results) {
    res.json(results);
  } else {
    res
      .status(500)
      .send(`JSON data for ${property} = ${property_value} is not available`);
  }
});

router.get("/publishers", (req, res) => {
  //retreiving only publishers, making sure theres unique entries
  pubs = Array.from(new Set(hero_info.map((hero) => hero["Publisher"])));
  //removing empty publisher entries
  const unique_pubs = pubs.filter((pub) => pub !== "");

  if (unique_pubs) {
    res.json(unique_pubs);
  } else {
    res.status(500).send("JSON data is not available");
  }
});

//getting for a specific hero ID
router.get("/:hero_id", (req, res) => {
  let id = req.params.hero_id;
  id = sanitize(id.trim());

  const hero = hero_info.find((p) => p.id === parseInt(id));

  if (hero) {
    res.send(hero);
  } else {
    res.status(404).send(`Hero ${id} not found`);
  }
});

router.get("/:hero_id/powers", (req, res) => {
  let id = req.params.hero_id;
  id = sanitize(id.trim());
  const hero = hero_info.find((p) => p.id === parseInt(id));
  const powers = hero_powers.find((p) => p.hero_names == hero.name);
  let power_arr = [];

  if (powers !== null && typeof powers !== "undefined") {
    power_arr = Object.entries(powers);
    power_arr = power_arr
      .filter(([key, value]) => value == "True")
      .map(([key, value]) => key);
  }
  if (power_arr) {
    res.json(power_arr);
  } else {
    res.status(500).send("JSON data is not available");
  }
});

//returns IDs
router.get("/:field/:pattern/:n", (req, res) => {
  let field = req.params.field;
  field = sanitize(field.trim());
  let pattern = req.params.pattern;
  pattern = sanitize(pattern.trim());
  let n = req.params.n;
  n = sanitize(n.trim());

  matches = hero_info.filter((h) => h[field] == pattern).slice(0, parseInt(n));

  if (matches) {
    res.json(matches);
  } else {
    res.status(500).send("JSON data is not available");
  }
});

//get all available patterns for a specified field

router.get("/search/:field", (req, res) => {
  let field = req.params.field;
  field = sanitize(field.trim());

  patterns = Array.from(new Set(hero_info.map((h) => h[field])));

  if (patterns) {
    res.json(patterns);
  } else {
    res.status(500).send("JSON data is not available");
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);

  fs.readFile("superheroes/superhero_info.json", "utf8", (err, data) => {
    if (err) {
      //console.error(err);
      res.status(500).send("Internal Server Error");
    } else {
      hero_info = JSON.parse(data);
      fs.readFile("superheroes/superhero_powers.json", "utf8", (err, data) => {
        if (err) {
          console.error(err);
          res.status(500).send("Internal Server Error");
        } else {
          hero_powers = JSON.parse(data);
          power_list = JSON.parse(data);
          power_list = power_list[0];

          let newPowers = hero_powers.map(function (hero) {
            for (const power in hero) {
              if (power !== "hero_names" && hero[power] !== "True") {
                delete hero[power];
              }
            }
            return hero;
          });

          for (hero of hero_info) {
            let powers = newPowers.find((e) => e.hero_names == hero.name);
            let curr_powers = [];
            for (let power in powers) {
              if (power !== "hero_names") {
                curr_powers.push(power);
              }
            }
            hero.powers = curr_powers;
          }
        }
      });
    }
  });
});
