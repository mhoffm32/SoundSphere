import React from 'react';
import {useState,useEffect} from 'react';
import UnauthHome from './UnauthHome';

const Info = ({choice}) => {


    return (
        <div className='info'>
            <br/>
            <p>IM A TEXT BLURB</p>
            <UnauthHome></UnauthHome>
            <button value = "signup" onClick = {(e) => choice(e.target.value)}> Sign Up</button>
        </div>
    )
}


export default Info