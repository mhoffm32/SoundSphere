import React from 'react';
import {useState} from 'react';


const SignUp = ({onSignup}) => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');


    const handleSignup = () => {
    // Validate login details (you can add your own validation logic here)
        if (username && password) {
        // Send login details to the parent component
        onSignup({username, password});
        } else {
        alert('Please enter both username and password.');
        }
    };


    return(
        <div className='login'>
            <span>
            Email: <input type="text" id="email" onChange={(e) => setUsername(e.target.value)}/><br/>
            Password: <input type="text" id="password" onChange={(e) => setPassword(e.target.value)}/>
            </span>
            <button onClick={handleSignup}>Sign Up</button>
        </div>
    )
}

export default SignUp;