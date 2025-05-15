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
        `http://localhost:5001/hero/search/${
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
      <h2 className="general-title">Super Hero Search</h2>
      <div className="search-input-container">
        <p>
          <p className="input-txt">Hero-Name:</p>
          <input
            type="text"
            id="email"
            placeholder="enter name..."
            onChange={(e) => setHName(e.target.value)}
          />
        </p>
        <p>
          <p className="input-txt">Race:</p>
          <input
            id="hero-races"
            maxLength="50"
            placeholder="enter race..."
            onChange={(e) => setSRace(e.target.value)}
          ></input>
        </p>
        <p>
          <p className="input-txt">Power:</p>
          <input
            id="hero-powers"
            maxLength="50"
            placeholder="enter power..."
            onChange={(e) => setSPower(e.target.value)}
          ></input>
        </p>
        <p>
          <p className="input-txt">Publisher:</p>
          <input
            id="pub-input"
            maxLength="50"
            placeholder="enter publisher..."
            onChange={(e) => setSPub(e.target.value)}
          ></input>
        </p>
        <button className="submit-btn" id="search" onClick={getResults}>
          Search
        </button>
      </div>
      <br />
      <div id="results">
        {searchResults !== null && searchResults !== undefined && (
          <div className="results-inner">
            {searchResults.map((result, index) => (
              <div key={index} className="search-result">
                <div
                  className="result-header"
                  onClick={() => toggleExpansion(index)}
                >
                  <h3>Name: {result.name}</h3>
                  <h3>
                    Publisher: {result.Publisher}{" "}
                    {expandedResults.includes(index) ? `    ▲` : "     ▼"}
                  </h3>
                </div>
                {expandedResults.includes(index) && (
                  <div className="result-details">
                    <p>
                      <strong>Gender:</strong> {result.Gender}
                      <br />
                      <strong>Race:</strong> {result.Race} <br />
                      <strong>Alignment:</strong> {result.Alignment}
                      <br />
                      <strong>Hair Color:</strong> {result["Hair color"]}
                      <br />
                      <strong>Skin Color:</strong> {result["Skin color"]} <br />
                      <strong>Eye Color:</strong> {result["Eye color"]}
                      <br />
                      <strong>Height:</strong> {result["Height"]} <br />
                      <strong>Weight:</strong> {result.Weight}
                      <br /> <strong>Powers:</strong> {result.powers.join(", ")}
                    </p>
                    <button
                      className="search-btn-form submit-btn"
                      onClick={() => {
                        window.open(
                          `https://duckduckgo.com/${result.name}%20${result.Publisher}`
                        );
                      }}
                    >
                      Search
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
