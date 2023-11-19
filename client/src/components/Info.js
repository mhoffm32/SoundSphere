import React from 'react';
import {useState} from 'react';

const Info = ({choice}) => {

    return (
        <div className='info'>
            <p>info....</p><br/>
            <button value = "signup" onClick = {(e) => choice(e.target.value)}> Sign Up</button>
            <button value = "login" onClick = {(e) => choice(e.target.value)}> Sign In</button>
        </div>
    )
}


export default Info