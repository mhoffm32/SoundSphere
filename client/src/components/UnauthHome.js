import React from 'react';
import {useState,useEffect} from 'react';
import HeroSearch from './HeroSearch';
import PublicLists from "./PublicLists"

const UnauthHome = () => {
    const [localstate, setstate] = useState('home')
    
    return (
        <div className='unauth-home'> 
        <button id="options" value="hero-search" onClick={(e) => setstate(e.target.value)}>Search Heroes</button>
        <button id="options" value="public-lists" onClick={(e) => setstate(e.target.value)}>View Public Lists</button>
        {localstate == "hero-search" ? <HeroSearch/> : <></>}
        {localstate == "public-lists" ? <PublicLists/> : <></>}
        </div>
    )
}


export default UnauthHome;