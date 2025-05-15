const express = require("express");
const natural = require("natural");
const router = express.Router();
const fs = require("fs");
const { sanitize, areStringsSimilar } = require("../utils/sanitizer");
//const { hero_info, hero_powers, power_list } = require("../server");

const {
  getHeroInfo,
  getHeroPowers,
  getPowerList,
} = require("../utils/heroData");

// Default route - sends all hero info data
router.get("/", (req, res) => {
  const hero_info = getHeroInfo();
  if (hero_info) {
    res.json(hero_info);
  } else {
    res.status(500).send("JSON data for info is not available");
  }
});

// Get all powers
router.get("/powers", (req, res) => {
  const power_list = getPowerList();
  if (power_list) {
    const powers = Object.keys(power_list).filter(
      (prop) => prop !== "hero_names"
    );
    res.json([...new Set(powers)]);
  } else {
    res.status(500).send("JSON data for powers is not available");
  }
});

// Get all races
router.get("/races", (req, res) => {
  if (hero_info) {
    const raceList = [...new Set(hero_info.map((hero) => hero["Race"]))];
    res.json(raceList);
  } else {
    res.status(500).send("JSON data for races is not available");
  }
});

// Get all publishers
router.get("/publishers", (req, res) => {
  if (hero_info) {
    const pubs = [...new Set(hero_info.map((hero) => hero["Publisher"]))];
    const unique_pubs = pubs.filter((pub) => pub !== "");
    res.json(unique_pubs);
  } else {
    res.status(500).send("JSON data is not available");
  }
});

// Advanced search by multiple criteria
router.get(
  "/search/:hero_name/:hero_race/:hero_power/:hero_publisher",
  (req, res) => {
    const name = decodeURIComponent(sanitize(req.params.hero_name));
    const race = decodeURIComponent(sanitize(req.params.hero_race));
    const power = decodeURIComponent(sanitize(req.params.hero_power));
    const publisher = decodeURIComponent(sanitize(req.params.hero_publisher));

    const filter = {
      name,
      Race: race,
      powers: power,
      Publisher: publisher,
    };

    const filteredHeroes = hero_info.filter((hero) =>
      Object.entries(filter).every(([key, value]) => {
        if (value.trim() === "none") {
          return true;
        }
        if (key === "powers") {
          const lowercaseArray = hero[key].map((val) => val.toLowerCase());
          return lowercaseArray.includes(value.toLowerCase());
        } else {
          return (
            areStringsSimilar(hero[key].toLowerCase(), value.toLowerCase()) ||
            hero[key].toLowerCase().startsWith(value.toLowerCase())
          );
        }
      })
    );
    res.json(filteredHeroes);
  }
);

// Search by property and sort
router.get("/search/:property/:property_value/:sortBy", (req, res) => {
  const property = sanitize(req.params.property.trim());
  const property_value = sanitize(req.params.property_value.trim());
  const sortBy = sanitize(req.params.sortBy.trim());

  let results = hero_info;
  const truePowers = hero_powers.map((hero) => {
    const pows = Object.entries(hero)
      .filter(([prop, val]) => val === "True" && prop !== "hero_names")
      .map(([prop]) => prop);
    return { name: hero["hero_names"], powers: pows };
  });

  if (property.toLowerCase() === "power") {
    results = truePowers
      .filter((hero) =>
        hero.powers
          .map((p) => p.toLowerCase())
          .includes(property_value.toLowerCase())
      )
      .map((hero) => hero_info.find((h) => h.name === hero.name));
  } else {
    results = hero_info.filter(
      (hero) =>
        String(hero[property]).toLowerCase() === property_value.toLowerCase()
    );
  }

  results = results.map((hero) => {
    const h_powers = truePowers.find((h) => h.name === hero.name);
    return { ...hero, powers: h_powers ? h_powers.powers : [] };
  });

  if (sortBy.toLowerCase() === "power") {
    results.sort((a, b) => b.powers.length - a.powers.length);
  } else if (sortBy.toLowerCase() !== "none") {
    results.sort((a, b) => a[sortBy].localeCompare(b[sortBy]));
  }

  if (results.length > 0) {
    res.json(results);
  } else {
    res
      .status(500)
      .send(`JSON data for ${property} = ${property_value} is not available`);
  }
});

// Get all available patterns for a specified field
router.get("/search/:field", (req, res) => {
  const field = sanitize(req.params.field.trim());

  if (hero_info) {
    const patterns = [...new Set(hero_info.map((h) => h[field]))];
    res.json(patterns);
  } else {
    res.status(500).send("JSON data is not available");
  }
});

// Get info for a specific hero by ID
router.get("/:hero_id", (req, res) => {
  const id = sanitize(req.params.hero_id.trim());

  const hero = hero_info.find((p) => p.id === parseInt(id));

  if (hero) {
    res.send(hero);
  } else {
    res.status(404).send(`Hero ${id} not found`);
  }
});

// Get powers for a specific hero by ID
router.get("/:hero_id/powers", (req, res) => {
  const id = sanitize(req.params.hero_id.trim());
  const hero = hero_info.find((p) => p.id === parseInt(id));

  if (!hero) {
    return res.status(404).send(`Hero ${id} not found`);
  }

  const powers = hero_powers.find((p) => p.hero_names === hero.name);
  let power_arr = [];

  if (powers) {
    power_arr = Object.entries(powers)
      .filter(([key, value]) => value === "True" && key !== "hero_names")
      .map(([key]) => key);
  }

  res.json(power_arr);
});

// Get a limited number of heroes by field and pattern
router.get("/:field/:pattern/:n", (req, res) => {
  const field = sanitize(req.params.field.trim());
  const pattern = sanitize(req.params.pattern.trim());
  const n = parseInt(sanitize(req.params.n.trim()), 10);

  if (hero_info) {
    const matches = hero_info.filter((h) => h[field] === pattern).slice(0, n);
    res.json(matches);
  } else {
    res.status(500).send("JSON data is not available");
  }
});

// Delete a list (legacy route)
router.post("/deleteList", (req, res) => {
  try {
    const jsonData = fs.readFileSync("data/superhero_lists.json", "utf8");
    const jsonArray = JSON.parse(jsonData);
    const newData = req.body;

    const exists = jsonArray.some(
      (list) => list.name.toLowerCase() === newData.name.toLowerCase()
    );

    if (!exists) {
      res.status(409).json({ error: "List does not exist" });
    } else {
      const newArray = jsonArray.filter(
        (list) => list.name.toLowerCase() !== newData.name.toLowerCase()
      );
      fs.writeFileSync(
        "data/superhero_lists.json",
        JSON.stringify(newArray, null, 2)
      );
      res.json({ message: "Data deleted successfully" });
    }
  } catch (error) {
    console.error("Error deleting data from the JSON file:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting data from the file" });
  }
});

// Get past lists (legacy route)
router.get("/past_lists", (req, res) => {
  fs.readFile("data/superhero_lists.json", "utf8", (err, data) => {
    if (err) {
      console.error("Error reading superhero lists:", err);
      res.status(500).send("Internal Server Error");
    } else {
      try {
        const lists = JSON.parse(data);
        res.json(lists);
      } catch (parseError) {
        console.error("Error parsing superhero lists:", parseError);
        res.status(500).send("Internal Server Error");
      }
    }
  });
});

module.exports = router;
