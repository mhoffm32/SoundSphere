import React from 'react';
import {useState,useEffect} from 'react';

const Info = ({choice}) => {
    return (
        <div className='info'>
        <br/>
            <p> Info.... </p>
            <p>Heroes ...</p>
            <p>LALLAA ...</p>
            <button value = "signup" onClick = {(e) => choice(e.target.value)}> Sign Up</button>
        </div>
    )
}


export default Info