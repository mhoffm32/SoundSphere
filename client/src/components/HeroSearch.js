import React from "react";
import { useState, useEffect } from "react";

//
const HeroSearch = ({ choice }) => {
  const [hero_name, setHName] = useState("none");
  const [hero_races, setHRaces] = useState([]);
  const [hero_powers, setHPowers] = useState([]);
  const [publishers, setpublishers] = useState([]);
  const [searchResults, setResults] = useState([]);
  const [selectedRace, setSRace] = useState("none");
  const [selectedPower, setSPower] = useState("none");
  const [selectedPub, setSPub] = useState("none");

  const [expandedResults, setExpandedResults] = useState([]);

  const toggleExpansion = (index) => {
    if (expandedResults.includes(index)) {
      setExpandedResults(
        expandedResults.filter((expandedIndex) => expandedIndex !== index)
      );
    } else {
      setExpandedResults([...expandedResults, index]);
    }
  };

  const getResults = async () => {
    try {
      const response = await fetch(
        `/api/hero/search/${
          hero_name ? encodeURIComponent(hero_name.trim()) : "none"
        }/${selectedRace ? encodeURIComponent(selectedRace.trim()) : "none"}/${
          selectedPower ? encodeURIComponent(selectedPower.trim()) : "none"
        }/${selectedPub ? encodeURIComponent(selectedPub.trim()) : "none"}`
      );
      const searchResults = await response.json();

      if (!response.ok) {
        console.error(
          `Request to fetch search results ${response.status}: ${response.statusText}`
        );
      } else {
        console.log("search Results: ", searchResults);
        setResults(searchResults);
      }
    } catch (error) {
      console.error("Error with search results:", error.message);
    }
  };

  return (
    <div className="hero-search">
      <h2>Super Hero Search</h2>
      Hero-Name:{" "}
      <input
        type="text"
        id="email"
        placeholder="any"
        onChange={(e) => setHName(e.target.value)}
      />
      <span>
        Race:
        <input
          id="hero-races"
          maxLength="50"
          onChange={(e) => setSRace(e.target.value)}
        ></input>
      </span>
      <span>
        Power:
        <input
          id="hero-powers"
          maxLength="50"
          onChange={(e) => setSPower(e.target.value)}
        ></input>
      </span>
      <span>
        Publisher:
        <input
          id="pub-input"
          maxLength="50"
          onChange={(e) => setSPub(e.target.value)}
        ></input>
      </span>
      <button id="search" onClick={getResults}>
        Search
      </button>
      <br />
      <div id="results">
        {searchResults !== null && searchResults !== undefined && (
          <div>
            {searchResults.map((result, index) => (
              <div key={index} className="search-result">
                <div
                  className="result-header"
                  onClick={() => toggleExpansion(index)}
                >
                  <h3>
                    Name: {result.name} | Publisher: {result.Publisher}{" "}
                    {expandedResults.includes(index) ? ` ▲` : " ▼"}
                  </h3>
                </div>
                {expandedResults.includes(index) && (
                  <div className="result-details">
                    <p>
                      Gender: {result.Gender}
                      <br />
                      Race: {result.Race} <br />
                      Alignment: {result.Alignment}
                      <br />
                      Hair Color: {result["Hair color"]}
                      <br />
                      Skin Color: {result["Skin color"]} <br />
                      Eye Color: {result["Eye color"]}
                      <br />
                      Height: {result["Height"]} <br />
                      Weight: {result.Weight}
                      <br /> Powers: {result.powers.join(", ")}
                    </p>
                    <button
                      onClick={() => {
                        window.open(
                          `https://duckduckgo.com/${result.name}%20${result.Publisher}`
                        );
                      }}
                    >
                      Search on DDG
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroSearch;
