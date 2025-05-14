const fs = require("fs");
const path = require("path");

let hero_info = [];
let hero_powers = [];
let power_list = [];

// Function to load data asynchronously
function loadHeroData(callback) {
  // Correct the relative path by using __dirname for absolute paths
  const heroInfoPath = path.join(
    __dirname,
    "superheroes",
    "superhero_info.json"
  );
  const heroPowersPath = path.join(
    __dirname,
    "superheroes",
    "superhero_powers.json"
  );

  fs.readFile(heroInfoPath, "utf8", (err, data) => {
    if (err) {
      callback(err);
      return; // Early exit if error occurs while loading hero_info
    }
    hero_info = JSON.parse(data); // Parse superhero_info.json

    fs.readFile(heroPowersPath, "utf8", (err, data) => {
      if (err) {
        callback(err);
        return; // Early exit if error occurs while loading hero_powers
      }
      hero_powers = JSON.parse(data); // Parse superhero_powers.json

      // Modify the powers data (assuming the power_list is in the first item of hero_powers)
      power_list = hero_powers[0]; // If power_list should be the first object

      // Clean up hero_powers by keeping only relevant power properties
      let newPowers = hero_powers.map((hero) => {
        for (const power in hero) {
          if (power !== "hero_names" && hero[power] !== "True") {
            delete hero[power]; // Delete non-true power properties
          }
        }
        return hero;
      });

      // Assign powers to each hero based on their name
      for (const hero of hero_info) {
        let powers = newPowers.find((e) => e.hero_names === hero.name);
        let curr_powers = [];

        // Loop through powers and add them to the current hero
        for (let power in powers) {
          if (power !== "hero_names") {
            curr_powers.push(power); // Only push powers (exclude hero_names)
          }
        }
        hero.powers = curr_powers;
      }

      // Callback when everything is done
      callback(null);
    });
  });
}

// Export the loaded data and the loader function
module.exports = {
  loadHeroData,
  getHeroInfo: () => hero_info,
  getHeroPowers: () => hero_powers,
  getPowerList: () => power_list,
};
