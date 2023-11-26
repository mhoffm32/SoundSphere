import React from 'react';
import {useState,useEffect} from 'react';
import HeroSearch from './HeroSearch';
import PublicLists from "./PublicLists"

const UnauthHome = ({choice}) => {
    const [localstate, setstate] = useState('home')
    return (
        {state === "home" }
        <div className='unauth-home'>
            
        </div>
    )
}


export default UnauthHome;