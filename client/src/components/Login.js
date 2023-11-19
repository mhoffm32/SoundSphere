import React from 'react';
import {useState} from 'react';
import User from "../User.js"

const Login = ({setState, setUser}) => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLog = () => {
        if (username && password) {

            setState("loggedIn")
            setUser(new User("fName", "lName", username, password))
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

            <button onClick={handleLog}>Login</button>
        </div>
    )
}

export default Login;