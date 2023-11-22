import React from 'react';
import {useState,useEffect} from 'react';

const Info = ({choice}) => {

    const [backendData, setBackendData] = useState([{}])


    return (
        <div className='info'>
        {(typeof backendData === "undefined") ? (
        <p>Loading...</p> 
        ) : (
        backendData.map((list, i) => (<p key={i}>{list.name}</p>))
        )}<br/>
            <button value = "signup" onClick = {(e) => choice(e.target.value)}> Sign Up</button>
            <button value = "login" onClick = {(e) => choice(e.target.value)}> Sign In</button>
        </div>
    )
}


export default Info