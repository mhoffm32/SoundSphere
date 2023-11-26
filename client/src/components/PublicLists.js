import React from 'react';
import {useState,useEffect} from 'react';


const PublicLists = () => {
    const [expandedResults, setExpandedResults] = useState([]);
    
    const toggleExpansion = (index) => {
        if (expandedResults.includes(index)) {
          setExpandedResults(expandedResults.filter((expandedIndex) => expandedIndex !== index));
        } else {
          setExpandedResults([...expandedResults, index]);
        }
      };
    
    return (
        <div className='public-lists'>
            <h1>Public Hero Lists</h1>

            {heroLists !== null && heroLists !== undefined && (
                <div>
                {heroLists.map((list, index) => (
                  <div key={index} className="search-result">
                    <div className="result-header" onClick={() => toggleExpansion(index)}>
                    <h3>{list.name} | Created By: {list.creator} | Heroes:{list.heroes.length} | Rating: {list.rating} {expandedResults.includes(index) ? ` ▲` : ' ▼'}</h3>
                    </div>
                    {expandedResults.includes(index) && (
                      <div className="result-details">

                       <p>more details about the list</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

            )}
        </div>
    )
}

export default PublicLists;