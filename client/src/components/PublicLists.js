import React from 'react';
import {useState,useEffect} from 'react';


const PublicLists = () => {
    const [expandedResults, setExpandedResults] = useState([]);
    const [heroLists, setLists] = useState()

    const toggleExpansion = (index) => {
        if (expandedResults.includes(index)) {
          setExpandedResults(expandedResults.filter((expandedIndex) => expandedIndex !== index));
        } else {
          setExpandedResults([...expandedResults, index]);
        }
    };

    useEffect(() => {
        getLists()
    }, []);

    const getLists = async () => {
        //sorted too 
        try {
            const response = await fetch(`/api/lists/unauth-public-lists`);
            const listObj = await response.json();

            if (!response.ok) {
                console.error(`Request to fetch lists failed with status ${response.status}: ${response.statusText}`);
            } else {
                console.log(listObj)
                setLists(listObj)
            }

        } catch (error) {
            console.error('Error fetching Public Lists:', error.message);
        }

    }

    return (
        <div className='public-lists'>
            <h1>Public Hero Lists</h1>

            {heroLists !== null && heroLists !== undefined && (
                <div>
                {heroLists.map((list, index) => (
                  <div key={index} className="search-result">
                    <div className="result-header" onClick={() => toggleExpansion(index)}>
                    <h3> {list.ListName} | Created By: {list.creator} | Heroes: {list.heroes.length} | Rating: {list.rating} {expandedResults.includes(index) ? ` ▲` : ' ▼'}</h3>
                    </div>
                    {expandedResults.includes(index) && (
                      <div className="result-details">
                       {list.heroes.map((hero,index)=>(
                        <div key={index}>
                        <p>Name: {hero.name}</p>
                        <p>: {hero.name}</p>
                        </div>
                       ))}
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