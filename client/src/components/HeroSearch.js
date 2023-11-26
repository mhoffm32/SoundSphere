import React from 'react';
import {useState,useEffect} from 'react';

//
const HeroSearch = ({choice}) => {
    const [hero_name, setHName] = useState('none')
    const [hero_races, setHRaces] = useState([])
    const [hero_powers, setHPowers] = useState([])
    const [publishers, setpublishers] = useState([])
    const [searchResults, setResults] = useState([])

    const [selectedRace, setSRace] = useState('none')
    const [selectedPower, setSPower] = useState('none')
    const [selectedPub, setSPub] = useState('none')

    const [expandedResults, setExpandedResults] = useState([]);

    useEffect(() => {
        fillOptions()
    }, []);

    const toggleExpansion = (index) => {
      if (expandedResults.includes(index)) {
        setExpandedResults(expandedResults.filter((expandedIndex) => expandedIndex !== index));
      } else {
        setExpandedResults([...expandedResults, index]);
      }
    };

    const fillOptions = async () => {
        try {
            const response = await fetch(`/api/hero/publishers`);
            const publishersL = await response.json();

            if (!response.ok) {
                console.error(`Request to fetch publishers failed with status ${response.status}: ${response.statusText}`);
            } else {
                setpublishers(publishersL)
            }

        } catch (error) {
            console.error('Error fetching publishers:', error.message);
        }

        try {
            const response = await fetch(`/api/hero/powers`);
            const powersL = await response.json();

            if (!response.ok) {
                console.error(`Request to fetch powers failed with status ${response.status}: ${response.statusText}`);
            } else {
                setHPowers(powersL)
            }
        } catch (error) {
            console.error('Error fetching powers:', error.message);
        }

        try {
            const response = await fetch(`/api/hero/races`);
            const racesL = await response.json();

            if (!response.ok) {
                console.error(`Request to fetch races failed with status ${response.status}: ${response.statusText}`);
            } else {
                setHRaces(racesL)
            }
        } catch (error) {
            console.error('Error fetching races:', error.message);
        }
    }

    const getResults = async () => {

        if(!hero_name){
            setHName('none')
        }

        try {
            const response = await fetch(`/api/hero/search/${hero_name ? encodeURIComponent(hero_name.trim()) : 'none'}/${encodeURIComponent(selectedRace.trim())}/${encodeURIComponent(selectedPower.trim())}/${encodeURIComponent(selectedPub.trim())}`);
            const searchResults = await response.json();

            if (!response.ok) {
                console.error(`Request to fetch search results ${response.status}: ${response.statusText}`);
            } else {
                console.log("search Results: ",searchResults)
                setResults(searchResults)
            }

        } catch (error) {
            console.error('Error with search results:', error.message);
        }
    }

    return (
        <div className='hero-search'>
           <h2>Super Hero Search</h2>
            Hero-Name: <input type="text" id="email" placeholder="any" onChange={(e) => setHName(e.target.value)}/>
            {hero_races !== null && hero_races !== undefined && (
                <span>
                    Race:
                    <select id="hero-races" value= {selectedRace} onChange={(e) => setSRace(e.target.value)}>
                        <option id="no-sort" key="none" value="none">None</option>
                            {hero_races.map(race => (
                            <option value={race} key={race}>{race}</option>
                            ))}
                    </select>
                </span>
            )}
            {hero_powers !== null && hero_powers !== undefined && (
                <span>
                    Power:
                    <select id="hero-powers" value= {selectedPower} onChange={(e) => setSPower(e.target.value)}>
                        <option id="no-sort" key="none" value="none">None</option>
                            {hero_powers.map(power => (
                            <option value={power} key={power}>{power}</option>
                            ))}
                    </select>
                </span>
            )}
            {publishers !== null && publishers !== undefined && (
                <span>
                    Publisher:
                   <select id="hero-publisher" value= {selectedPub} onChange={(e) => setSPub(e.target.value)}>
                        <option id="no-sort" key="none" value="none">None</option>
                            {publishers.map(pub => (
                            <option value={pub} key={pub}>{pub}</option>
                            ))}
                    </select>
                </span>
            )}
            

            <button id="search" onClick={getResults}>Search</button>
            <br/>
            <div id='results'>
                
            {searchResults !== null && searchResults !== undefined && (
                <div>
                {searchResults.map((result, index) => (
                  <div key={index} className="search-result">
                    <div className="result-header" onClick={() => toggleExpansion(index)}>
                    <h3> Name: {result.name} | Publisher: {result.Publisher}   {expandedResults.includes(index) ? ` ▲` : ' ▼'}</h3>
                    </div>
                    {expandedResults.includes(index) && (
                      <div className="result-details">
                        <p>Gender: {result.Gender}<br/>Race: {result.Race} <br/>Alignment: {result.Alignment} 
                        <br/>Hair Color: {result["Hair color"]}<br/>Skin Color: {result["Skin color"]} <br/>Eye Color: {result["Eye color"]}
                        <br/>Height: {result["Height"]} <br/>Weight: {result.Weight}<br/> Powers: {result.powers.join(", ")}</p>
                        <button onClick={()=> window.location.href = `https://duckduckgo.com/${result.name}%20${result.Publisher}`}>Search on DDG</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

            )}
            </div>

        </div>
        

    )


}


export default HeroSearch;