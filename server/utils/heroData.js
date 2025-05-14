const fs = require("fs");

let hero_info = [];
let hero_powers = [];
let power_list = [];

// Function to load data asynchronously
function loadHeroData(callback) {
  fs.readFile("superheroes/superhero_info.json", "utf8", (err, data) => {
    if (err) {
      callback(err);
    } else {
      hero_info = JSON.parse(data);

      fs.readFile("superheroes/superhero_powers.json", "utf8", (err, data) => {
        if (err) {
          callback(err);
        } else {
          hero_powers = JSON.parse(data);
          power_list = JSON.parse(data);
          power_list = power_list[0];

          // Modify hero_powers as needed (same logic as before)
          let newPowers = hero_powers.map(function (hero) {
            for (const power in hero) {
              if (power !== "hero_names" && hero[power] !== "True") {
                delete hero[power];
              }
            }
            return hero;
          });

          // Update hero_info with powers
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

          // Return the loaded data
          callback(null);
        }
      });
    }
  });
}

// Export the loaded data and the loader function
module.exports = {
  loadHeroData,
  getHeroInfo: () => hero_info,
  getHeroPowers: () => hero_powers,
  getPowerList: () => power_list,
};
